var express = require("express");
var dayjs = require("dayjs");
const util = require("util");
const bcrypt = require("bcryptjs");

var router = express.Router();

var db = require("../database");
const utils = require("../utils");

router.use((req, res, next) => {
  console.log("---------------------------");
  console.log("auth", req.url, "@", dayjs().format("YYYY-MM-DD hh:mm:ss"));
  console.log("---------------------------");
  next();
});

router.post("/verifyToken", (req, res, next) => {
  console.log("-------------------------------");
  console.log("----- VERIFY TOKEN -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    try {
      let token = req.body.data;
      const result = await utils.verifyToken(token);
      if (result.token_valid) {
        const query = util.promisify(conn.query).bind(conn);
        const user = await query("SELECT * FROM user WHERE user.id = ?", result.token_decoded.id);
        if (user.length > 0) {
          if (user[0].email === result.token_decoded.email && user[0].password === result.token_decoded.password) {
            const newToken = await utils.createToken(user[0]);
            console.log("Token is valid: true");
            res.send({ token: newToken, token_valid: true, user: user[0] });
            conn.release();
          } else {
            console.log("Token is valid: false");
            res.send({ token_valid: false });
            conn.release();
          }
        } else {
          res.send({ token_valid: true, user: false });
          conn.release();
        }
      } else {
        console.log("Token is valid: false");
        res.send({ token_valid: false });
        conn.release();
      }
      console.log("-------------------------------");
    } catch (err) {
      throw err;
    }
  });
});

router.post("/login", async (req, res) => {
  console.log("-------------------------------");
  console.log("----- LOGIN -----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    const query = util.promisify(conn.query).bind(conn);
    let data = req.body.data;
    try {
      const user = await query(`SELECT * FROM user WHERE email = '${data.email}'`);
      console.log("E-mail: ", data.email);

      if (user.length > 0) {
        console.log("E-mail exist: true");

        const comparePassword = await bcrypt.compare(data.password, user[0].password);
        if (comparePassword) {
          console.log("Password is correct: true");
          console.log("-------------------------------");
          let jwtToken = await utils.createToken(user[0]);
          res.send({ user: user[0], token: jwtToken });
          conn.release();
        } else {
          console.log("Password is correct: false");
          console.log("-----------------------------------");
          res.send({ user: null, message: "Password incorreta, por favor verifique novamente!" });
          conn.release();
        }
      } else {
        console.log("E-mail exist: false");
        console.log("-----------------------------------");
        res.send({ user: null, message: "Utilizador não existe, por favor verifique novamente!" });
        conn.release();
      }
    } catch (err) {
      throw err;
    }
  });
});

router.post("/auth/register", (req, res, next) => {
  console.log("---- REGISTER ----");
  let data = req.body.data;

  delete data.health_professional;
  delete data.confirm_password;

  db.getConnection(async (error, conn) => {
    if (error) throw error;
    const query = util.promisify(conn.query).bind(conn);
    try {
      const user = await query(`SELECT * FROM user WHERE email = ?`, data.email);
      if (user.length > 0) {
        console.log("E-mail already exist");
        console.log("-----------------------------------");
        res.send({ registered: false, message: "Este e-mail já se encontra registado" });
        conn.release();
      } else {
        let cryptedPassword = await bcrypt.hash(data.password, 10);
        data.password = cryptedPassword;
        await query(`INSERT INTO user SET ?`, data);
        console.log("User registedred: true");
        console.log("E-mail: ", data.email);
        console.log("-----------------------------------");
        res.send({ registered: true });
        conn.release();
      }
    } catch (err) {
      throw err;
    }
  });
});

module.exports = router;
