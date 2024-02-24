const multer = require("multer");
const Guid = require("guid");
const fs = require("fs");
const Utils = require("./Utils");
const sanityClient = require("./SanityConfig");

//set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathUpload = `./public/uploads/${req.user.name}`;
    if (!fs.existsSync(pathUpload)) {
      fs.mkdirSync(pathUpload, { recursive: true });
    }
    cb(null, pathUpload);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + Guid.raw() + ".jpg";
    cb(null, fileName);
  },
});

//upload multiple files
const upload = multer({ storage: storage });

const removeFileInDisk = (path) => {
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
  });
};

//sanity
const uploadImageToSanity = (filepath) => {
  return new Promise((resolve, reject) => {
    sanityClient.assets
      .upload("image", fs.createReadStream(filepath))
      .then((document) => {
        removeFileInDisk(filepath);
        resolve(document);
      })
      .catch((error) => {
        console.log(error);
        reject(new Error("Upload image failed!"));
      });
  });
};

module.exports = {
  upload: upload,
  removeFileInDisk: removeFileInDisk,
  uploadImageToSanity: uploadImageToSanity,
};
