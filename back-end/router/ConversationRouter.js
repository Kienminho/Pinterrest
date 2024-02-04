const express = require("express");
const router = express.Router();
const ConversationController = require("../controller/ConversationController");

//tạo cuộc trò chuyện mới
router.post("/create-conversation", ConversationController.createConversation);

//lấy tất cả cuộc trò chuyện của user
router.get(
  "/conversation-by-user/:userId",
  ConversationController.getConversation
);

module.exports = router;
