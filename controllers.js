const puppeteer = require("puppeteer");

const flipkart = async (req, res) => {
  try {
    let url =
      "https://www.flipkart.com/mobiles-accessories/mobiles/pr?sid=tyy,4io&otracker=categorytree";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let data = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll("div._1AtVbE > div._13oc-S");
      items.forEach((item) => {
        results.push({
          name: item.querySelector("div._4rR01T").innerText,
          price: item.querySelector("div._30jeq3").innerText,
        });
      });
      return results;
    });
    await browser.close();
    res.send(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const snapdeal = async (req, res) => {
  try {
    let url = "https://www.snapdeal.com/search?keyword=tshirts&sort=rlvncy";
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
      return results;
    });
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
    let flipkartUrl =
      "https://www.flipkart.com/mobiles-accessories/mobiles/pr?sid=tyy,4io&otracker=categorytree";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(flipkartUrl);
    let urls = await page.$$eval("div._1AtVbE > div._13oc-S", (link) => {
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
