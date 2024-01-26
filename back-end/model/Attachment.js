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
  FileSize: {
    type: Number,
    required: true,
  },
  FileExtension: {
    type: String,
    required: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);

module.exports = Attachment;
