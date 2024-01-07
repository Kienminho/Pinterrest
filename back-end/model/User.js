const mongoose = require("../common/ConfigDB");

const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  Password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  Avatar: {
    type: String,
    default: "/images/avatar.jpg",
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
    required: true,
    min: 6,
    max: 255,
  },
  Gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
    required: true,
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
    default: Date.now,
  },
  UpdatedAt: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
