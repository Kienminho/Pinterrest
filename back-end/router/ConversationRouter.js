const express = require("express");
const router = express.Router();
const ConversationController = require("../controller/ConversationController");
const AuthenticateService = require("../common/AuthenticateService");

//tạo cuộc trò chuyện mới
router.post(
  "/create-conversation",
  AuthenticateService.authenticateToken,
  ConversationController.createConversation
);

//lấy tất cả cuộc trò chuyện của user
router.get(
  "/conversation-by-user",
  AuthenticateService.authenticateToken,
  ConversationController.getConversation
);

module.exports = router;
