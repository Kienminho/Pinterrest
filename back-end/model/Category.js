const mongoose = require("../common/ConfigDB");

const CategorySchema = new mongoose.Schema({
  Index: {
    type: Number,
    unique: true,
    required: true,
    default: 1, // Start at 1
  },
  Name: {
    type: String,
    unique: true,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  CreatedAt: {
    type: Date,
    default: Date.now("en-US", { timezone: "Asia/Ho_Chi_Minh" }),
  },
  UpdatedAt: {
    type: Date,
    required: false,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
