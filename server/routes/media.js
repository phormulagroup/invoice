var express = require("express");
const dayjs = require("dayjs");
const util = require("util");
const fs = require("fs");
var fileUpload = require("express-fileupload");

const { uploadFile } = require("../utils/upload");

var router = express.Router();
router.use(fileUpload());

var db = require("../utils/database");

router.use((req, res, next) => {
  console.log("----------------------------");
  console.log(req.url, "@", dayjs().format("YYYY-MM-DD HH:mm:ss"));
  console.log("----------------------------");
  next();
});

router.get("/read", (req, res) => {
  console.log("---- GET MEDIA ----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    try {
      const query = util.promisify(conn.query).bind(conn);
      const rows = await query("SELECT * FROM media WHERE type = 'multimedia' ORDER BY created_at DESC");
      res.send(rows);
      conn.release();
    } catch (e) {
      throw e;
    }
  });
});

router.post("/singleUpload", async (req, res) => {
  console.log("---- UPLOAD media ----");
  try {
    console.log(req.files.file);
    const fileResponse = await uploadFile(req.files.file);
    console.log(fileResponse);
    res.send(fileResponse);
  } catch (e) {
    throw e;
  }
});

router.post("/upload", async (req, res) => {
  console.log("---- UPLOAD media ----");
  try {
    let files = req.files.file.length ? req.files.file : [req.files.file];

    files.forEach(async (file) => {
      await uploadFile(file);
    });

    res.send({ message: "Success, all files uploaded!" });
  } catch (e) {
    throw e;
  }
});

router.post("/delete", (req, res) => {
  console.log("---- DELETE MEDIA ----");
  db.getConnection(async (error, conn) => {
    if (error) throw error;
    let data = req.body.data;
    try {
      fs.unlink(`./media/${data.name}`, async (err) => {
        if (err) console.log(err);
        console.log(`File ${data.name} has been successfully removed.`);
        const query = util.promisify(conn.query).bind(conn);
        const deletedRow = await query("DELETE FROM media WHERE id = ?", data.id);
        res.send(deletedRow);
        conn.release();
      });
    } catch (err) {
      throw err;
    }
  });
});

module.exports = router;
