const Utils = require("../common/Utils");

/// <summary>
/// Handle upload files - multiple files
/// </summary>
const HandleUploadFiles = async (req, res) => {
  try {
    //save files
    const listPath = req.listPath;
    const listDownloadLink = (listPath || []).map((path) => {
      return Utils.createThumbnailPath(path);
    });

    return res
      .status(200)
      .json(
        Utils.createSuccessResponseModel(
          listDownloadLink.length,
          listDownloadLink
        )
      );
  } catch (error) {
    console.log("File Controller - Line 21: " + error.message);
    return res
      .status(500)
      .json(Utils.createErrorResponseModel(500, error.message));
  }
};

module.exports = {
  HandleUploadFiles: HandleUploadFiles,
};
