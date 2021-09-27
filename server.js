const express = require("express");
const { flipkart, snapdeal, flipkart_full } = require("./controllers");
const app = express();
app.use(express.json());

app.get("/fetch/flipkart/mobile", flipkart)

app.get("/fetch/snapdeal/tshirts", snapdeal);

app.get("/fetch/flipkart/mobile/full", flipkart_full);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
