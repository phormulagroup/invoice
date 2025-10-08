const axios = require("axios");
const dayjs = require("dayjs");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const util = require("util");
const nodemailer = require("nodemailer");
const db = require("../utils/database");

const privateJwtKey = "phormula_invoice_api_secret_key_!@#$%&*()_+1234567890-=qwertyuiop";

async function getAuthorizationCode(c) {
  const params = {
    client_id: c.CLIENT_ID,
    redirect_uri: c.REDIRECT_URI,
    response_type: "code",
    scope: c.SCOPE,
  };

  try {
    const response = await axios.get(`${c.AUTH_URL}?${qs.stringify(params)}`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400, // follow only up to 302
    });

    // Expecting 302 redirect with code in Location header
    const location = response.headers.location;
    if (!location) throw new Error("No redirect location found");

    const url0bj = new URL(location);
    const code = url0bj.searchParams.get("code");

    if (!code) throw new Error("No code found in redirect URL");

    return code;
  } catch (err) {
    console.error("❌ Failed to get authorization code:", err.message);
    process.exit(1);
  }
}

async function exchangeTokenForTokens(code, c) {
  return new Promise(async (resolve, reject) => {
    const credentials = Buffer.from(`${c.CLIENT_ID}:${c.CLIENT_SECRET}`).toString("base64");

    const data = {
      grant_type: "authorization_code",
      code,
      scope: c.SCOPE,
    };

    try {
      const response = await axios.post(c.TOKEN_URL, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
          Accept: "application/json",
        },
      });
      resolve(response.data);
    } catch (err) {
      console.error("❌ Error:", err.code || err.message);
      if (err.response) {
        console.error("❌ Response:", err.response.data);
      }
      reject(err.response ? err.response.data : err.code);
    }
  });
}

module.exports = {
  //Get Authorization Code and Tokens
  auth: function (c) {
    return new Promise(async (resolve, reject) => {
      try {
        const code = await getAuthorizationCode(c);
        const token = await exchangeTokenForTokens(code, c);
        resolve(token);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  //Create Invoice
  create: function (obj, token, c, tax) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          document_type: "FR",
          date: dayjs().format("YYYY-MM-DD"),
          finalize: 0,
          customer_tax_registration_number: obj.order.meta_data.filter((m) => m.key === "_billing_nif")[0]?.value ?? "999999990",
          customer_business_name: obj.order.billing.first_name + " " + obj.order.billing.last_name,
          date: dayjs().format("YYYY-MM-DD"),
          payment_mechanism: "MO",
          vat_included_prices: obj.tax ? false : true,
          operation_country: obj.order.billing.country ?? "PT",
          currency_iso_code: obj.order.currency,
          lines: obj.tax
            ? obj.items.map((p) => ({ item_type: "Product", description: p.name, quantity: p.quantity, unit_price: p.total, tax_percentage: tax }))
            : obj.items.map((p) => ({ item_type: "Product", description: p.name, quantity: p.quantity, unit_price: p.total })),
        };

        const response = await axios.post(`${c.BASE_URL}/api/v1/commercial_sales_documents`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        resolve(response.data);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  //Validate NIF
  validaNIF: function (value) {
    value = value + "";

    // has 9 digits?
    if (!/^[0-9]{9}$/.test(value)) return false;

    // is from a person?
    if (!/^[123]|45|5/.test(value)) return false;

    // digit check
    let tot = value[0] * 9 + value[1] * 8 + value[2] * 7 + value[3] * 6 + value[4] * 5 + value[5] * 4 + value[6] * 3 + value[7] * 2;
    let div = tot / 11;
    let mod = tot - parseInt(div) * 11;
    let tst = mod == 1 || mod == 0 ? 0 : 11 - mod;
    return value[8] == tst;
  },

  //JWT functions
  verifyToken: function (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, privateJwtKey, function (err, decoded) {
        if (err) {
          resolve({ token_valid: false, error: err });
        } else {
          delete decoded.iat;
          delete decoded.exp;
          resolve({ token_valid: true, token_decoded: decoded });
        }
      });
    });
  },

  createToken: function (data) {
    return new Promise((resolve, reject) => {
      jwt.sign(JSON.parse(JSON.stringify(data)), privateJwtKey, { expiresIn: "7d" }, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },

  sendEmail: function (data) {
    return new Promise((resolve, reject) => {
      db.getConnection(async (error, conn) => {
        if (error) throw error;
        try {
          const query = util.promisify(conn.query).bind(conn);
          const rows = await query("SELECT * FROM email WHERE domain = ? OR is_default = 1", data.domain);
          let filteredSmtp = rows.filter((item) => item.domain === data.domain)[0];
          const smtpSettings = filteredSmtp ? filteredSmtp : rows.filter((item) => item.is_default === 1)[0];

          const transporter = nodemailer.createTransport({
            host: smtpSettings.host,
            port: smtpSettings.port,
            secure: smtpSettings.secure, // true for port 465, false for other ports
            auth: {
              user: smtpSettings.email,
              pass: smtpSettings.password,
            },
          });

          const html = `<table style="width: 100%; max-width: 600px; margin: auto">
              <tr>
                <td style="text-align: center; vertical-align: middle;"><img style="max-height:100px" src="https://invoiceapi.phormuladev.com/media/${smtpSettings.img}" /></td>
              </tr>
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  <p>Exmo. Senhor(a),</p>
                  <p>Neste e-mail segue a fatura nº${data.id_invoice}, de acordo com o pagamento realizado, para a consultar carregue no botão abaixo.</p>
                  <a href="${data.link}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                    <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Fatura</span></span>
                  </a>
                  <p>Melhores cumprimentos,</p>
                  <p>${smtpSettings.name}</p>
                </td>
              </tr>
            </table>`;

          const mailOptions = {
            from: `${smtpSettings.name} <${smtpSettings.email}>`,
            to: data.order.billing.email,
            subject: `${smtpSettings.name} - Fatura nº${data.id_invoice}`,
            html: html,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) resolve(err);
            resolve(info);
            conn.release();
          });
        } catch (err) {
          resolve(err);
          conn.release();
        }
      });
    });
  },
};
