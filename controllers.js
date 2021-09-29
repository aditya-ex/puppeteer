const puppeteer = require("puppeteer");

const flipkart = async (req, res) => {
  try {
    let url = `https://www.amazon.in/s?k=${req.body.name}`;
    let asin = req.body.asin;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    let results = {};
    results.index = await page.$eval(
      `div.s-result-item[data-asin='${asin}']`,
      (el) => el.getAttribute("data-index")
    );
    await browser.close();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const snapdeal = async (req, res) => {
  try {
    let url = "https://www.snapdeal.com/search?keyword=tshirts&sort=rlvncy";
    let asin = req.body.asin;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let data = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll("div.favDp");
      items.forEach((item) => {
        results.push({
          name: item.querySelector("p.product-title").innerText,
          price: item.querySelector("span.product-price").innerText,
        });
      });
      console.log(asin);
      return results;
    });
    console.log(asin);
    await browser.close();
    res.send(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    res.send("an error occurred");
  }
};

const flipkart_full = async (req, res) => {
  try {
    let url = `https://www.amazon.in/s?k=${req.body.value}`;
    let asin = req.body.asin;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let result = [];
    let items = await page.$$eval(`div.asin`, (link) => {
      link = link.map((el) => el.querySelector("a._1fQZEK").href);
      return link;
    });
    let data = async (link) => {
      let obj = {};
      let newPage = await browser.newPage();
      await newPage.goto(link);
      obj.name = await newPage.$eval("span.B_NuCI", (text) => text.innerText);
      obj.price = await newPage.$eval("div._16Jk6d", (text) => text.innerText);
      obj.rating = await newPage.$eval("div._2d4LTz", (text) => text.innerText);
      obj.ratingAndReview = await newPage.$eval(
        "span._2_R_DZ > span > span",
        (text) => text.innerText
      );
      obj.highlights = await newPage.$eval(
        "li._21Ahn-",
        (text) => text.innerText
      );
      obj.sellersCode = await newPage.$eval(
        "div._1RLviY > span > span",
        (text) => text.innerText
      );
      obj.sellersRating = await newPage.$eval(
        "div._1D-8OL",
        (text) => text.innerText
      );
      await newPage.close();
      return obj;
    };
    for (link in urls) {
      let pageData = await data(urls[link]);
      console.log(pageData);
    }
    res.send("fetched data");
    await browser.close();
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

module.exports = { flipkart, snapdeal, flipkart_full };
