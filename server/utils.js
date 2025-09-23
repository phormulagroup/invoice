const axios = require("axios");
const dayjs = require("dayjs");
const qs = require("querystring");
const jwt = require("jsonwebtoken");

const BASE_URL = "https://api18.toconline.pt";
const CLIENT_ID = "pt515028533_c375481-a8693acaceda7018";
const CLIENT_SECRET = "88b5b7efdec304f66cf3116e6198c5d0";
const REDIRECT_URI = "https://oauth.pstmn.io/v1/callback";
const AUTH_URL = "https://app18.toconline.pt/oauth/auth";
const TOKEN_URL = "https://app18.toconline.pt/oauth/token";
const SCOPE = "commercial";

const privateJwtKey = "phormula_invoice_api_secret_key_!@#$%&*()_+1234567890-=qwertyuiop";

async function getAuthorizationCode() {
  const params = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
  };

  try {
    const response = await axios.get(`${AUTH_URL}?${qs.stringify(params)}`, {
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

async function exchangeTokenForTokens(code) {
  return new Promise(async (resolve, reject) => {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const data = {
      grant_type: "authorization_code",
      code,
      scope: SCOPE,
    };

    try {
      const response = await axios.post(TOKEN_URL, data, {
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
  auth: function (data) {
    return new Promise(async (resolve, reject) => {
      try {
        const code = await getAuthorizationCode();
        const token = await exchangeTokenForTokens(code);
        resolve(token);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  //Create Invoice
  create: function (obj, token) {
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
          vat_included_prices: true,
          operation_country: obj.order.billing.country ?? "PT",
          currency_iso_code: obj.order.currency,
          apply_retention_when_paid: true,
          lines: obj.items.map((p) => ({ item_type: "Product", description: p.name, quantity: p.quantity, unit_price: p.total })),
        };

        const response = await axios.post(`${BASE_URL}/api/v1/commercial_sales_documents`, data, {
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
};
