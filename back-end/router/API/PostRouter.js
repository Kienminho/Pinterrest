const express = require("express");
const router = express.Router();
const AuthenticateService = require("../../common/AuthenticateService");
const PostController = require("../../controller/API/PostController");

router.get(
  "/get-posts-by-categories",
  AuthenticateService.authenticateToken,
  PostController.HandleGetPostsByCategories
);

router.get(
  "/get-posts-by-user/:id",
  AuthenticateService.authenticateToken,
  PostController.HandleGetPostsByUser
);

router.get(
  "/get-detail-post/:postId",
  AuthenticateService.authenticateToken,
  PostController.HandleGetDetailPost
);

router.post(
  "/create-post",
  AuthenticateService.authenticateToken,
  PostController.HandleCreatePost
);

router.put(
  "/update-post",
  AuthenticateService.authenticateToken,
  PostController.HandleUpdatePost
);

router.get(
  "/search",
  AuthenticateService.authenticateToken,
  PostController.SearchPost
);

module.exports = router;
