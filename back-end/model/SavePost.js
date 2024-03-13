const mongoose = require("../common/ConfigDB");
const SavePostSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
});

const SavePost = mongoose.model("SavePost", SavePostSchema);
module.exports = SavePost;
