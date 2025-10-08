var express = require("express");
var dayjs = require("dayjs");
const util = require("util");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");

var router = express.Router();
router.use(fileUpload());

var db = require("../utils/database");

router.use((req, res, next) => {
  console.log("---------------------------");
  console.log("email", req.url, "@", dayjs().format("YYYY-MM-DD hh:mm:ss"));
  console.log("---------------------------");
  next();
});

router.get("/read", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- READ E-MAIL -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const rows = await query("SELECT * FROM email");
      conn.release();
      res.send(rows);
    } catch (err) {
      throw err;
    }
  });
});

router.post("/create", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- CREATE E-MAIL -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const insertRow = await query("INSERT INTO email SET ?", data);
      console.log("Domain:", data.domain ?? "no domain");
      console.log("SMTP Host:", data.host ?? "no smtp");
      console.log("----------");
      conn.release();
      res.send({ email_created: insertRow.insertId ? true : false });
    } catch (err) {
      throw err;
    }
  });
});

router.post("/update", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- UPDATE E-MAIL -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      let whereId = data.id;
      delete data.id;

      const query = util.promisify(conn.query).bind(conn);
      const updatedRow = await query("UPDATE email SET ? WHERE id = ?", [data, whereId]);
      console.log("Domain:", data.domain ?? "no domain");
      console.log("SMTP Host:", data.host ?? "no smtp");
      console.log("----------");
      conn.release();
      res.send(updatedRow);
    } catch (err) {
      throw err;
    }
  });
});

router.post("/delete", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- DELETE E-MAIL -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const deletedRow = await query("DELETE FROM email WHERE id = ?", data.id);
      console.log("Domain:", data.domain ?? "no domain");
      console.log("SMTP Host:", data.host ?? "no smtp");
      console.log("----------");
      conn.release();
      res.send(deletedRow);
    } catch (err) {
      throw err;
    }
  });
});

router.post("/test", (req, res, next) => {
  console.log("---- TEST E-MAIL SMTP ----");

  try {
    const data = req.body.data;
    console.log(data);
    const transporter = nodemailer.createTransport({
      host: data.host,
      port: data.port,
      secure: data.secure, // true for port 465, false for other ports
      auth: {
        user: data.email,
        pass: data.password,
      },
    });

    const mailOptions = {
      from: `${data.name} <${data.email}>`,
      to: data.to,
      subject: "Send test e-mail",
      text: "Este e-mail foi enviado foi de teste do SMTP",
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.send(info);
      }
    });
  } catch (err) {
    throw err;
  }
});

router.post("/default", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- DEFAULT E-MAIL -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const deletedRow = await query("UPDATE email SET is_default = 1 WHERE id = ?; UPDATE email SET is_default = 0 WHERE id != ?", [data.id, data.id]);
      console.log("Domain:", data.domain ?? "no domain");
      console.log("SMTP Host:", data.host ?? "no smtp");
      console.log("----------");
      conn.release();
      res.send(deletedRow);
    } catch (err) {
      throw err;
    }
  });
});

module.exports = router;
