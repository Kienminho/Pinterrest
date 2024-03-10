const _Conversation = require("../../model/Conversation");
const _Message = require("../../model/Message");
const _User = require("../../model/User");
const Utils = require("../../common/Utils");

const createMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, message = "" } = req.body;
    if (!conversationId || !senderId || !receiverId || !message) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Invalid request"));
    }

    // Find sender and receiver
    const sender = await _User.findById(senderId);
    const receiver = await _User.findById(receiverId);

    if (!receiver) {
      return res
        .status(404)
        .json(Utils.createErrorResponseModel("Không tìm thấy người nhận!"));
    }

    let conversation = await _Conversation.findById(conversationId);
    if (!conversation) {
      conversation = new _Conversation({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }

    // Create message
    const newMessage = new _Message({
      conversationId: conversation._id,
      senderId: sender._id,
      message: message,
      isRead: [],
    });
    await newMessage.save();

    return res.json(
      Utils.createSuccessResponseModel(0, "Gửi tin nhắn thành công!")
    );
  } catch (error) {
    console.error("MessageController -> createMessage: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const readMessage = async (req, res) => {
  try {
    const { messageId, readerId } = req.body;
    if (!messageId || !readerId) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Invalid request"));
    }

    const message = await _Message.findById(messageId);
    if (message) {
      if (!message.isRead.includes(readerId) && readerId !== message.senderId) {
        message.isRead.push(readerId);
        await message.save();
      }
    }
    return res.json(
      Utils.createSuccessResponseModel(0, "Đã đọc tin nhắn thành công!")
    );
  } catch (error) {
    console.log("MessageController -> readMessage: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const getMessageByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const checkConversation = await _Conversation.findById(conversationId);

    if (checkConversation) {
      return res.json(await checkMessages(checkConversation._id));
    } else {
      return res.json(Utils.createSuccessResponseModel(0, []));
    }
  } catch (error) {
    console.error(
      "MessageController -> getMessageByConversation: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

//private function
const checkMessages = async (conversationId) => {
  const messages = await _Message.find({ conversationId });
  console.log(messages);
  const messageUserData = await Promise.all(
    messages.map(async (message) => {
      const user = await _User
        .findById(message.senderId)
        .select("UserName Avatar Email");
      return { message, user };
    })
  );
  return Utils.createSuccessResponseModel(0, messageUserData);
};

module.exports = {
  createMessage: createMessage,
  readMessage: readMessage,
  getMessageByConversation: getMessageByConversation,
};
