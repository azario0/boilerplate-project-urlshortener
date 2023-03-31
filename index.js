require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const isUrlHttp = require("is-url-http");

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let dict_websites = {};
let website_counter = 1;

app.post("/api/shorturl", (req, res) => {
  // url
  const url = req.body.url;
  if (isUrlHttp(url)) {
    if (dict_websites[url] !== undefined) {
      res.json({ original_url: url, short_url: dict_websites[url] });
    } else {
      dict_websites[url] = website_counter;
      website_counter = website_counter + 1;
    }
  } else {
    res.json({ error: "invalid url" });
  }
});



app.get("/api/shorturl/:link", (req, res) => {
  let ender = false;
  const { link } = req.params;
  Object.entries(dict_websites).forEach(([key, value]) => {
    console.log(key);
    console.log(value)
    if (Number(link) === value){
      res.redirect(key)
      ender = true;
    }
 });
  if (ender === false) {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
