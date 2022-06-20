const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apiCache = require("apicache");

// cache
let cache = apiCache.middleware;

// env
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// 2 分內回傳同一個res (Header: max-age 120)
router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    // Request Rebug
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST sent: ${API_BASE_URL}?${params}`);
    }

    const apiRes = await needle("get", `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
