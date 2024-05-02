var express = require("express");
var bodyParser = require("body-parser");

const models = require("../models/db");
const update = require("../utils/updateBuy");

const User = models.User;
const Buy = models.Buy;
const Sell = models.Sell;

const app = express();
app.use(bodyParser.json());

const loginPage = (req, res) => {
  res.render("login");
};
const signUpPage = (req, res) => {
  res.render("signup");
};
const buyPage = (req, res) => {
  res.render("buy", { userId: req.query.id });
};
const sellPage = (req, res) => {
  res.render("sell", { userId: req.query.id });
};
const homePage = (req, res) => {
  res.render("home", { userId: req.query?.id });
};

const usersData = async (req, res) => {
  Leave.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received credentials:", {
      username,
      password,
    });

    // Verify user credentials
    const user = await User.findOne({ username });
    // const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user || password != user.password) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    res.redirect("/energy/home?id=" + user.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    console.log("Received credentials:", {
      username,
      password,
      email,
    });

    // Verify user credentials
    const user = new User({ email, username, password });
    await user.save();
    // const user = await User.findOne({ username });

    res.redirect("/energy/home?id=" + user.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const buyFun = async (req, res) => {
  try {
    const { energy, price, userId } = req.body;
    const user = await User.findById(userId);
    console.log("User found:", user);

    if (!user) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }
    const buyObj = new Buy({
      quantity: energy,
      price: price,
      user: user,
      name: user.username,
    });
    await buyObj.save();
    res.render("buy", { userId: userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const sellFun = async (req, res) => {
  try {
    const { quantity, price, userId } = req.body;
    const user = await User.findById(userId);
    console.log("User found:", user);

    if (!user) {
      console.log("Invalid credentials");
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }
    const sellObj = new Sell({
      quantity: quantity,
      price: price,
      user: user,
      name: user.username,
    });
    await sellObj.save();
    res.render("sell", { userId: userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const adminUpdateFun = async (req, res) => {
  try {
    let sellData = await Sell.find().lean();
    let buyData = await Buy.find().lean();
    console.log(sellData, buyData);
    let remUsers = update(buyData, sellData);
    await Sell.deleteMany();
    await Buy.deleteMany();
    await Sell.insertMany([...remUsers.remSell]);
    await Buy.insertMany([...remUsers.remBuy]);
    console.log(remUsers);
    res.render("admin", {
      buyData: remUsers.remBuy_opt,
      sellData: remUsers.remSell_opt,
      opt_price: remUsers.opt_price,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const adminPage = async (req, res) => {
  try {
    res.render("admin", { buyData: [], sellData: [], opt_price: 0 });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  login,
  loginPage,
  signUpPage,
  signUp,
  buyPage,
  sellPage,
  usersData,
  homePage,
  sellFun,
  buyFun,
  adminUpdateFun,
  adminPage,
};
