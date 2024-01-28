const Utils = require("../common/Utils");
const Attachment = require("../model/Attachment");

/// <summary>
/// Handle upload files - multiple files
/// </summary>
const HandleUploadFile = async (req, res) => {
  try {
    //create attachment
    const attachment = await createFileAttachment(req);
    const ThumbnailPath = Utils.createThumbnailPath(attachment.FilePath);

    return res.status(200).json(
      Utils.createSuccessResponseModel(0, {
        ...attachment.toObject(),
        ThumbnailPath,
      })
    );
  } catch (error) {
    console.log("File Controller - Line 21: " + error.message);
    return res
      .status(500)
      .json(Utils.createErrorResponseModel(500, error.message));
  }
};

const createFileAttachment = async (req) => {
  const attachment = new Attachment({
    OriginalFileName: req.file.originalname,
    FilePath: req.file.path,
    FileName: req.file.filename,
    FileSize: Utils.calcFileSize(req.file.size),
    FileType: req.file.mimetype,
    FileExtension: Utils.getFileExtension(req.file.originalname),
    CreatedName: req.user.name,
  });
  await attachment.save();
  return attachment;
};

module.exports = {
  HandleUploadFile: HandleUploadFile,
};
