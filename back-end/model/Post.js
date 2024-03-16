const mongoose = require("../common/ConfigDB");

const PostSchema = new mongoose.Schema({
  Title: {
    type: String,
    unique: false,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  Attachment: {
    Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: false,
    },
    Thumbnail: {
      type: String,
      required: false,
    },
  },
  Category: [
    {
      type: Number,
      require: false,
    },
  ],
  TotalLike: {
    type: Number,
    default: 0,
  },
  TotalComment: {
    type: Number,
    default: 0,
  },
  IsComment: {
    type: Boolean,
    default: true,
  },
  SimilarPosts: {
    type: Boolean,
    default: true,
  },
  Created: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  CreatedAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
  UpdateAt: {
    type: Date,
    required: false,
  },
  Updated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
