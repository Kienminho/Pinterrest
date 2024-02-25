const multer = require("multer");
const axios = require("axios");
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

//get base64 from file path
const generateBase64FromImageUrl = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data, "binary");
      return imageBuffer.toString("base64");
    } else {
      throw new Error("Failed to download image");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

module.exports = {
  upload: upload,
  removeFileInDisk: removeFileInDisk,
  uploadImageToSanity: uploadImageToSanity,
  getBase64FromFile: generateBase64FromImageUrl,
};
