const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

// Rate Limiting
// Header: X-Rate-Limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // 10分內可以送幾次
  max: 5,
});

app.use(limiter);
app.set("trust proxy", 1);

// headers 一定要再define route 之前！！！
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // get 以外的都會先Options 詢問可不可以
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  next();
});

// set static folder(for 顯示前端)
// app.use(express.static("public"));

// Route
app.use("/api", require("./routes"));

// Enable cors
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
