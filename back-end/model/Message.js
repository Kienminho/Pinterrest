const mongoose = require("../common/ConfigDB");
const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Array,
  },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
