const mongoose = require("../common/ConfigDB");

const ReactionSchema = new mongoose.Schema({
  postOrCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reaction = mongoose.model("Reaction", ReactionSchema);
module.exports = Reaction;
