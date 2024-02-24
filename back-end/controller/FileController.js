const Utils = require("../common/Utils");
const Attachment = require("../model/Attachment");
const _FileService = require("../common/FileService");
/// <summary>
/// Handle upload files - multiple files
/// </summary>
const HandleUploadFile = async (req, res) => {
  try {
    //upload file to cloud
    const fileSanity = await _FileService.uploadImageToSanity(req.file.path);
    //create attachment
    const attachment = await createFileAttachment(req, fileSanity);
    const ThumbnailPath = fileSanity.url;

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

const createFileAttachment = async (req, fileSanity) => {
  const attachment = new Attachment({
    OriginalFileName: fileSanity.originalFilename,
    FilePath: fileSanity.path,
    FileName: req.file.filename,
    FileSize: Utils.calcFileSize(req.file.size),
    FileType: fileSanity.mimeType,
    FileExtension: Utils.getFileExtension(fileSanity.originalFilename),
    CreatedName: req.user.name,
  });
  await attachment.save();
  return attachment;
};

module.exports = {
  HandleUploadFile: HandleUploadFile,
};
