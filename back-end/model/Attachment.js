const mongoose = require("../common/ConfigDB");

const AttachmentSchema = new mongoose.Schema({
  OriginalFileName: {
    type: String,
    unique: false,
    required: false,
    min: 6,
    max: 255,
  },
  FilePath: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  FileName: {
    type: String,
    required: true,
  },
  FileSize: {
    type: Number,
    required: true,
  },
  FileType: {
    type: String,
    required: true,
  },
  FileExtension: {
    type: String,
    required: true,
  },
  AttachmentType: {
    type: String,
    required: true,
  },
  PostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
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
  CreatedName: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);

module.exports = Attachment;
