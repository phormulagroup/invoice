const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const dayjs = require("dayjs");
const express = require("express");

const db = require("./utils/database");

const authRouter = require("./routes/auth");
const invoiceRouter = require("./routes/invoice");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

// Limitação de taxa para evitar abusos
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 600,
});

app.use(limiter);

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`---------- STARTING SERVER ----------`);
  console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`Server running at ${PORT}`);
  console.log(`--------------------`);
});

db.getConnection((error, conn) => {
  console.log(`---------- CONNECTING TO DB ----------`);
  if (error) {
    throw error;
  } else {
    console.log("MySQL database is connected successfully");
    console.log(`--------------------`);
    conn.release();
  }
});

app.get("/", async (req, res) => {
  res.send("INVOICE API!");
});

app.use("/auth", authRouter);
app.use("/invoice", invoiceRouter);
app.use("/user", userRouter);

module.exports = app;
