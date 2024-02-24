const express = require("express");
const router = express.Router();
const GenerationController = require("../controller/GenerationController");

router.post("/create-image-from-text", GenerationController.CreateImageToText);

module.exports = router;
