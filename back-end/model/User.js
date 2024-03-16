const mongoose = require("../common/ConfigDB");

const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    unique: false,
    required: false,
    min: 6,
    max: 255,
  },
  Password: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  Category: [
    {
      type: Number,
      required: false,
    },
  ],
  Avatar: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg",
    unique: false,
    required: false,
  },
  Email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  FullName: {
    type: String,
    required: false,
    unique: false,
    min: 6,
    max: 255,
  },
  Gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
    default: "Khác",
    required: false,
  },
  Birthday: {
    type: Date,
    default: "01/01/2000",
    required: false,
  },
  Role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  FirstLogin: {
    type: Boolean,
    default: true,
  },
  TypeLogin: {
    type: String,
    enum: ["local", "facebook", "google"],
    default: "local",
  },
  RefreshToken: {
    type: String,
    required: false,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
  CreatedAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
  UpdatedAt: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
