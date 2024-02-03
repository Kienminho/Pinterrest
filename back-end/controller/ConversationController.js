const _User = require("../model/User");
const _Conversation = require("../model/Conversation");
const Utils = require("../common/Utils");

const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const userSender = await _User.findById(senderId);
    const userReceiver = await _User.findById(receiverId);
    if (!userSender || !userReceiver) {
      return res
        .status(400)
        .json(
          Utils.createErrorResponseModel(
            `${!userSender ? "Người gửi" : "Người nhận"} không tồn tại.`
          )
        );
    }

    const memberInfo = [
      {
        userId: senderId,
        avatar: userSender.Avatar,
      },
      {
        userId: receiverId,
        avatar: userReceiver.Avatar,
      },
    ];
    console.log(memberInfo);

    const conversation = new _Conversation({
      members: memberInfo,
    });
    await conversation.save();
    return res.status(200).json(Utils.createSuccessResponseModel());
  } catch (error) {
    console.log(
      "ConversationController -> createConversation -> error",
      error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const getConversationByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await _Conversation.find({
      members: {
        $elemMatch: {
          userId: userId,
        },
      },
    });
    return res
      .status(200)
      .json(
        Utils.createSuccessResponseModel(conversation.length, conversation)
      );
  } catch (error) {
    console.log(
      "ConversationController -> getConversationByUser -> error",
      error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

module.exports = {
  createConversation: createConversation,
  getConversation: getConversationByUser,
};
