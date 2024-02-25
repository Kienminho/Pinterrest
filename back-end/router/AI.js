const express = require("express");
const router = express.Router();
const GenerationController = require("../controller/AIController");

router.post("/create-image-from-text", GenerationController.CreateImageToText);
router.post("/summarizes-content", GenerationController.SummarizesContent);

module.exports = router;
