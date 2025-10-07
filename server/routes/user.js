var express = require("express");
var dayjs = require("dayjs");
const util = require("util");
const bcrypt = require("bcryptjs");

var router = express.Router();

var db = require("../utils/database");

router.use((req, res, next) => {
  console.log("---------------------------");
  console.log("user", req.url, "@", dayjs().format("YYYY-MM-DD hh:mm:ss"));
  console.log("---------------------------");
  next();
});

router.get("/read", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- READ USERS -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const rows = await query("SELECT * FROM user");
      conn.release();
      res.send(rows);
    } catch (err) {
      throw err;
    }
  });
});

router.post("/create", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- CREATE USER -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      const query = util.promisify(conn.query).bind(conn);
      data.password = await bcrypt.hash(data.password, 10);
      const insertRow = await query("INSERT INTO user SET ?", data);
      console.log("E-mail:", data.email ?? "no e-mail");
      console.log("Name:", data.name ?? "no name");
      console.log("Password (encrypted):", data.password ?? "no password");
      console.log("----------");
      conn.release();
      res.send({ user_created: insertRow.insertId ? true : false });
    } catch (err) {
      throw err;
    }
  });
});

router.post("/update", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- UPDATE USER -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      if (data.new_password) {
        let encryptedPassword = await bcrypt.hash(data.new_password, 10);
        data.password = encryptedPassword;
        delete data.new_password;
      }

      let whereId = data.id;
      delete data.id;

      const query = util.promisify(conn.query).bind(conn);
      const updatedRow = await query("UPDATE user SET ? WHERE id = ?", [data, whereId]);
      console.log("E-mail:", data.email ?? "no e-mail");
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
  console.log("----- DELETE USER -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body?.data;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const deletedRow = await query("DELETE FROM user WHERE id = ?", data.id);
      console.log("E-mail:", data.email ?? "no e-mail");
      console.log("----------");
      conn.release();
      res.send(deletedRow);
    } catch (err) {
      throw err;
    }
  });
});

module.exports = router;
