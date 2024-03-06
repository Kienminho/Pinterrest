const express = require("express");
const router = express.Router();
const MessageController = require("../controller/MessageController.js");
const AuthenticateService = require("../common/AuthenticateService");

router.post(
  "/create-message",
  AuthenticateService.authenticateToken,
  MessageController.createMessage
);

router.post(
  "/read-message",
  AuthenticateService.authenticateToken,
  MessageController.readMessage
);

// get message by conversation
router.get(
  "/get-message/:conversationId",
  AuthenticateService.authenticateToken,
  MessageController.getMessageByConversation
);

module.exports = router;
