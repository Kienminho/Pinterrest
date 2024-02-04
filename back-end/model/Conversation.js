const mongoose = require("../common/ConfigDB");

const ConversationSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
  conversationName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
