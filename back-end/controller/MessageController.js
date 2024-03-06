const _Conversation = require("../model/Conversation");
const _Message = require("../model/Message");
const _User = require("../model/User");
const Utils = require("../common/Utils");

const createMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, message = "" } = req.body;
    if (!conversationId || !senderId || !receiverId || !message) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Invalid request"));
    }

    //find sender and receiver
    const sender = await _User.findById(senderId);
    const receiver = await _User.findById(receiverId);

    const conversation = await _Conversation.findById(conversationId);
    if (!conversation && receiver) {
      const newConversation = new _Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      //create message
      const newMessage = new _Message({
        conversationId: newConversation._id,
        senderId: sender._id,
        message: message,
        isRead: [],
      });
      await newMessage.save();

      return res.json(
        Utils.createSuccessResponseModel(0, "Gửi tin nhắn thành công!")
      );
    }
  } catch (error) {
    console.log("MessageController -> createMessage: " + error.message);
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
    const checkMessages = async (conversationId) => {
      const messages = await _Message.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await _User
            .findById(message.senderId)
            .select("UserName Avatar Email");
          return { message, user };
        })
      );
      return Utils.createSuccessResponseModel(0, messageUserData);
    };

    //get params
    const { conversationId } = req.params;
    if (conversationId === "new") {
      const checkConversation = await _Conversation.findOne({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        return checkMessages(checkConversation[0]._id);
      } else {
        return res.json(Utils.createSuccessResponseModel(0, []));
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log(
      "MessageController -> getMessageByConversation: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  createMessage: createMessage,
  readMessage: readMessage,
  getMessageByConversation: getMessageByConversation,
};
