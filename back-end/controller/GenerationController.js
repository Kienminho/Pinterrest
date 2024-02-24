const { Translate } = require("@google-cloud/translate").v2;
const axios = require("axios");
const fs = require("fs");

const _FileService = require("../common/FileService");
const Utils = require("../common/Utils");
const translate = new Translate({ keyFilename: "./public/credentials.json" });

const CreateImageToText = async (req, res) => {
  const imagePath = "./public/images/image.png";
  const text = await translateText(req.body.text);
  const data = JSON.stringify({
    text_prompts: [
      {
        text: text,
      },
    ],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30,
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
    headers: {
      "Content-Type": "application/json",
      Accept: "image/png",
      Authorization:
        "Bearer sk-JxvAc7eBG8ECeWf2XBH02y6brPbAuLP3NrrlaP0Fn8wAObZm",
      Cookie:
        "__cf_bm=A2a9NF0mP90pmRH0_p3A.Hwue4AL3G31xu8VUCMGw7w-1708791502-1.0-ARFEAWCo3VtpWxENNac3ifuTdC9UiRyzBoyvLK0zQoSoZjWoyuyoQ73mJieWPMI8WCBuVeBJm47P4Ip4gG7DYMY=",
    },
    data: data,
    responseType: "arraybuffer", // Set the response type to arraybuffer to receive binary data
  };
  axios
    .request(config)
    .then(async (response) => {
      // Save the image to the public folder
      fs.writeFileSync(imagePath, response.data);
      const fileSanity = await _FileService.uploadImageToSanity(imagePath);
      res.json(Utils.createSuccessResponseModel(0, fileSanity.url));
    })
    .catch((error) => {
      console.log(
        "GenerationController -> CreateImageToText: " + error.message
      );
      res.status(500).json(Utils.createErrorResponseModel(error.message));
    });
};

async function translateText(text) {
  try {
    const [translation] = await translate.translate(text, "en");
    return translation;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = {
  CreateImageToText: CreateImageToText,
};
