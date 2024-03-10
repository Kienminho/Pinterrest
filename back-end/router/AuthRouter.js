const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");

router.get("/login", AuthController.RenderLogin);

module.exports = router;
