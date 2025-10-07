const mysql = require("mysql");
const PORT = process.env.PORT || 3306;

const db = mysql.createPool({
  host: "185.118.114.199",
  database: "phormuladev_invoice",
  user: "phormuladev_invoice_user",
  password: "eg2+mQ*?JRXLI;fN",
  port: PORT,
  multipleStatements: true,
});

module.exports = db;
