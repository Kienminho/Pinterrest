const Utils = require("../common/Utils");
const _Attachment = require("../model/Attachment");
const _FileService = require("../common/FileService");

/// <summary>
/// Handle upload files - multiple files
/// </summary>
const HandleUploadFile = async (req, res) => {
  try {
    //upload file to cloud
    const fileSanity = await _FileService.uploadImageToSanity(req.file.path);
    console.log(fileSanity);
    const data = {
      name: req.user.name,
      filename: req.file.filename,
    };
    //create attachment
    const attachment = await createFileAttachment(data, fileSanity, "UPLOAD");
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

const createFileAttachment = async (data, fileSanity, type) => {
  const attachment = new _Attachment({
    OriginalFileName: fileSanity.originalFilename,
    AttachmentType: type,
    FilePath: fileSanity.path,
    FileName: data.filename,
    FileSize: Utils.calcFileSize(fileSanity.size),
    FileType: fileSanity.mimeType,
    FileExtension: Utils.getFileExtension(fileSanity.originalFilename),
    CreatedName: data.name,
  });
  await attachment.save();
  return attachment;
};

const GetAllAttachments = async (req, res) => {
  try {
    const { keyword, pageIndex, pageSize } = req.query;
    // Use aggregation pipeline for pagination and total count
    const pipeline = [
      {
        $match: {
          $or: [
            { OriginalFileName: { $regex: keyword, $options: "i" } },
            { CreateName: { $regex: keyword, $options: "i" } },
          ],
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [
            { $skip: (parseInt(pageIndex) - 1) * parseInt(pageSize) },
            { $limit: parseInt(pageSize) },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          data: 1,
        },
      },
    ];

    const result = await _Attachment.aggregate(pipeline);

    const totalCount = result[0]?.totalCount || 0;
    const data = result[0]?.data || [];

    return res
      .status(200)
      .json(Utils.createSuccessResponseModel(totalCount, data));
  } catch (error) {
    console.log("File Controller - Line 21: " + error.message);
    return res
      .status(500)
      .json(Utils.createErrorResponseModel(500, error.message));
  }
};

const GetAttachmentById = async (req, res) => {
  try {
    const attachment = await _Attachment.findById(req.params.id);
    return res
      .status(200)
      .json(Utils.createSuccessResponseModel(0, attachment));
  } catch (error) {
    console.log("File Controller - Line 21: " + error.message);
    return res
      .status(500)
      .json(Utils.createErrorResponseModel(500, error.message));
  }
};

module.exports = {
  HandleUploadFile: HandleUploadFile,
  GetAllAttachments: GetAllAttachments,
  GetAttachmentById: GetAttachmentById,
  createFileAttachment: createFileAttachment,
};
