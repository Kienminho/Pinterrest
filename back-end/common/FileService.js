const formidable = require("formidable");
const Guid = require("guid");
const fs = require("fs");
const Utils = require("./Utils");
const Attachment = require("../model/Attachment");

//handle uploading multiple files to a specified folder
const uploadFiles = (req, res, next) => {
  const listPaths = [];
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: "Upload files failed!" });
      return;
    }
    let processedCount = 0;
    files.files.forEach((file) => {
      if (file) {
        const fileName = Date.now() + "-" + Guid.raw() + ".jpg";
        //check exist path
        const basePath = `./public/uploads/${fields.typeUpload}/${fields.folder}`;
        if (!fs.existsSync(basePath)) {
          fs.mkdirSync(basePath, { recursive: true });
        }
        let newPath = `${basePath}/${fileName}`;
        fs.copyFile(file.filepath, newPath, (err) => {
          if (err) {
            console.log(err.message);
            return res
              .status(500)
              .json(Utils.createResponseModel(500, "Upload files failed!"));
          }
          listPaths.push(newPath);
          processedCount++;
          if (processedCount === files.files.length) {
            req.listPath = listPaths;
            next();
          }
        });
      } else {
        return res
          .status(400)
          .json(Utils.createResponseModel(400, "No file selected!"));
      }
    });
  });
};

const removeFileInDisk = (req, res) => {
  const { path } = req.body;
  if (!path) {
    return res
      .status(400)
      .json(Utils.createResponseModel(400, "Path is required!"));
  }
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err.message);
      return res
        .status(500)
        .json(Utils.createResponseModel(500, "Remove file failed!"));
    }
    return res
      .status(200)
      .json(Utils.createResponseModel(200, "Remove file successfully!"));
  });
};

module.exports = {
  uploadFiles: uploadFiles,
};
