const express = require("express");
const router = express.Router();
const AuthenticateService = require("../../common/AuthenticateService");
const CategoryController = require("../../controller/API/CategoryController");

router.get(
  "/get-all-categories",
  AuthenticateService.authenticateToken,
  CategoryController.HandleGetAllsCategories
);

router.post("/create-category", CategoryController.HandleCreateCategory);
router.delete(
  "/delete-category/:id",
  AuthenticateService.authenticateToken,
  CategoryController.HandleDeleteCategory
);
router.put("/update-category", CategoryController.HandleUpdateCategory);

module.exports = router;
