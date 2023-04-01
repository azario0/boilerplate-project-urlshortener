require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

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
  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };
  // url
  const url = req.body.url;

  if (isValidUrl(url)) {
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
    if (Number(link) === value) {
      res.redirect(key);
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
