const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToMongoDB = require("./db");
const app = express();
const port = 4000; // Choose any port number you prefer
const bodyParser = require("body-parser");
const Routes = require("./libs/controllers/index");

app.use(cors());
app.use("/images", express.static("images"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(bodyParser.json());
app.use("/api", Routes);
app.listen(port, () => {
  console.log(
    `Server is running on ${process.env.API_Domain}:${process.env.Port}`
  );
});
