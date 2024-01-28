const express = require("express");
const router = express.Router();
const AuthenticateService = require("../common/AuthenticateService");
const PostController = require("../controller/PostController");

router.get(
  "/get-posts-by-user",
  AuthenticateService.authenticateToken,
  PostController.HandleGetPostsByUser
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

module.exports = router;
