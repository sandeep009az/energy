require("dotenv").config();
var express = require("express");
const mongoose = require("mongoose");
var ejs = require("ejs");
var async = require("async");

const energyRoutes = require("./routes/energyRoutes");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/energy", energyRoutes);
const dbURI = process.env.DB_URL;

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("connected to db");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
