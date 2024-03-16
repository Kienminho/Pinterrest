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

router.post(
  "/admin-create-post",
  AuthenticateService.authenticateToken,
  PostController.AdminCreatePost
);

router.put(
  "/update-post",
  AuthenticateService.authenticateToken,
  PostController.HandleUpdatePost
);

router.delete(
  "/delete-post/:id",
  AuthenticateService.authenticateToken,
  PostController.HandleDeletePost
);

router.get(
  "/search",
  AuthenticateService.authenticateToken,
  PostController.SearchPost
);

// Save post
router.post(
  "/save-post",
  AuthenticateService.authenticateToken,
  PostController.HandleSavePost
);

// Unsave post
router.post(
  "/unsave-post",
  AuthenticateService.authenticateToken,
  PostController.HandleUnSavePost
);

// Get saved posts
router.post(
  "/get-saved-posts",
  AuthenticateService.authenticateToken,
  PostController.HandleGetSavePosts
);

module.exports = router;
