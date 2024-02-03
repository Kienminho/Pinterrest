const mongoose = require("../common/ConfigDB");

const FollowSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
});

const Follow = mongoose.model("Follow", FollowSchema);
module.exports = Follow;
