const express = require("express");
const router = express.Router();
const GenerationController = require("../../controller/API/AIController");
const AuthenticateService = require("../../common/AuthenticateService");

router.post(
  "/create-image-from-text",
  AuthenticateService.authenticateToken,
  GenerationController.CreateImageToText
);
router.post("/summarizes-content", GenerationController.SummarizesContent);

module.exports = router;
