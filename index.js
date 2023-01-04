const PORT = process.env.PORT || 3000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const app = express();

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/world/ukraine",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/world-60525350",
    base: "https://www.bbc.com/",
  },
  {
    name: "Washington Post",
    address: "https://www.washingtonpost.com/world/ukraine-russia/",
    base: "",
  },
  {
    name: "CNBC",
    address: "https://www.cnbc.com/europe-politics/",
    base: "",
  },
  {
    name: "Times of India",
    address: "https://timesofindia.indiatimes.com/world/europe",
    base: "https://timesofindia.indiatimes.com",
  },
  {
    name: "Aljazeera",
    address: "https://www.aljazeera.com/tag/ukraine-russia-crisis/",
    base: "https://www.aljazeera.com",
  },
  {
    name: "Ap News",
    address:
      "https://apnews.com/hub/russia-ukraine?utm_source=apnewsnav&utm_medium=featured",
    base: "https://apnews.com/",
  },
  {
    name: "The Hindu",
    address: "https://www.thehindu.com/topic/russia-ukraine-crisis/",
    base: "",
  },
  {
    name: "Independent",
    address: "https://www.independent.co.uk/news/world/europe",
    base: "https://www.independent.co.uk",
  },
  {
    name: "Abc News",
    address: "https://abcnews.go.com/International",
    base: "",
  },
  {
    name: "Reuters",
    address: "https://www.reuters.com/world/europe/",
    base: "https://www.reuters.com/",
  },
];

const articles = [];

newspapers.forEach(newspaper => {
  axios.get(newspaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Ukraine")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId",  (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].address
  const newspaperBase = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].base

  axios
    .get(newspaperAddress)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

     $('a:contains("Ukraine")', html).each(function () {
       const title = $(this).text();
       const url = $(this).attr("href");
       specificArticles.push({
         title,
         url: newspaperBase + url,
         source: newspaperId
       });
     });
      res.json(specificArticles);
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
