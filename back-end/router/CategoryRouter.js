const express = require("express");
const router = express.Router();
const AuthenticateService = require("../common/AuthenticateService");
const CategoryController = require("../controller/CategoryController");

router.get(
  "/get-all-categories",
  AuthenticateService.authenticateToken,
  CategoryController.HandleGetAllsCategories
);

router.post("/create-category", CategoryController.HandleCreateCategory);

module.exports = router;
