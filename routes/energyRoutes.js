var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var energyController = require("../controller/energy_controller");

const app = express();
app.use(bodyParser.json());

router.get("/usersdata", energyController.usersData);

router.get("/login", energyController.loginPage);
router.get("/signup", energyController.signUpPage);
router.get("/home", energyController.homePage);

router.get("/buy", energyController.buyPage);

router.get("/sell", energyController.sellPage);

router.post("/login", energyController.login);
router.post("/signup", energyController.signUp);
router.post("/buy", energyController.buyFun);
router.post("/sell", energyController.sellFun);
router.get("/admin/update", energyController.adminUpdateFun);
router.get("/admin", energyController.adminPage);

module.exports = router;
