var express = require("express");
var dayjs = require("dayjs");
const util = require("util");

var router = express.Router();

var db = require("../database");
const utils = require("../utils");
const exampleData = require("../example.json");

router.use((req, res, next) => {
  console.log("---------------------------");
  console.log("invoice", req.url, "@", dayjs().format("YYYY-MM-DD hh:mm:ss"));
  console.log("---------------------------");
  next();
});

router.get("/read", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- READ INVOICES -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const rows = await query("SELECT * FROM invoice");
      conn.release();
      res.send(rows);
    } catch (err) {
      throw err;
    }
  });
});

router.post("/create", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- CREATE INVOICE -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    //const data = req.body?.data ?? exampleData;
    const data = req.body?.data;
    try {
      if (
        utils.validaNIF(data.order.meta_data.filter((m) => m.key === "_billing_nif")[0]?.value) &&
        data.order.billing.email &&
        data.order.billing.first_name &&
        data.domain &&
        data.items.length > 0
      ) {
        console.log("Domain:", data.domain ?? "no domain");
        console.log("E-mail:", data.order.billing.email ?? "no e-mail");
        console.log("Name:", data.order.billing.first_name + " " + data.order.billing.last_name ?? "no name");

        const token = await utils.auth();
        let finalInvoice = await utils.create(data, token.access_token);

        console.log("----------");
        console.log("Invoice created:", data.order.billing.first_name + " " + data.order.billing.last_name ?? "no name");
        console.log("Invoice ID:", finalInvoice.id ?? "no id");
        console.log("Invoice link:", finalInvoice.public_link ?? "no link");
        const query = util.promisify(conn.query).bind(conn);
        const auxData = {
          domain: data.domain,
          email: data.order.billing.email,
          name: data.order.billing.first_name + " " + data.order.billing.last_name,
          nif: data.order.meta_data.filter((m) => m.key === "_billing_nif")[0]?.value ?? "999999990",
          invoice_id: finalInvoice.id,
          link: finalInvoice.public_link,
        };
        const insertRow = await query("INSERT INTO invoice SET ?", auxData);
        console.log("----------");
        console.log("Database insert ID:", insertRow.insertId ?? "no id");
        console.log("-------------------------------");
        conn.release();
        res.send(finalInvoice);
      } else {
        conn.release();
        console.log("----------");
        console.log("Invalid fields: invalid nif or missing domain, e-mail, name or items");
        console.log("Domain:", data.domain ?? "no domain");
        console.log("E-mail:", data.order.billing.email ?? "no e-mail");
        console.log("Name:", data.order.billing.first_name + " " + data.order.billing.last_name ?? "no name");
        console.log(
          "NIF:",
          data.order.meta_data.filter((m) => m.key === "_billing_nif")[0]?.value ?? "no nif",
          `${utils.validaNIF(data.order.meta_data.filter((m) => m.key === "_billing_nif")[0]?.value) ? "(valid)" : "(invalid)"}`
        );
        console.log("-------------------------------");
        res.send({ message: "Invalid fields" });
      }
    } catch (err) {
      throw err;
    }
  });
});

module.exports = router;
