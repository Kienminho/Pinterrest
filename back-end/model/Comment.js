const mongoose = require("../common/ConfigDB");

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "/images/avatar.jpg",
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: AuthorSchema,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    attachment: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false,
      },
      thumbnail: {
        type: String,
        required: false,
      },
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
      },
    ],
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
