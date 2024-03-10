const express = require("express");
const router = express.Router();
const AuthenticateService = require("../../common/AuthenticateService");
const CommentController = require("../../controller/API/CommentController");

router.get(
  "/get-comments-by-post/:postId",
  AuthenticateService.authenticateToken,
  CommentController.HandleGetCommentsByPost
);

router.post(
  "/create-comment",
  AuthenticateService.authenticateToken,
  CommentController.HandleCreateComment
);

router.post(
  "/create-reply-comment",
  AuthenticateService.authenticateToken,
  CommentController.HandleCreateReply
);

module.exports = router;
