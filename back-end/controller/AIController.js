const { Translate } = require("@google-cloud/translate").v2;
const { VertexAI } = require("@google-cloud/vertexai");
const axios = require("axios");
const fs = require("fs");

const _FileService = require("../common/FileService");
const _FileController = require("./FileController");
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
        "Bearer sk-vNnRAOk6q1Om9NKCVWCYs1ZFLHc6ux0sKpJjHhj7Y5MVon0B",
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
      const data = {
        name: req.user.name,
        filename: "AI-Generated-Image",
      };
      //create attachment
      const fileAI = await _FileController.createFileAttachment(
        data,
        fileSanity,
        "AI"
      );

      res.json(Utils.createSuccessResponseModel(0, fileSanity.url));
    })
    .catch((error) => {
      console.log(error);
      console.log(
        "GenerationController -> CreateImageToText: " + error.message
      );
      res.status(500).json(Utils.createErrorResponseModel(error.message));
    });
};

const SummarizesContent = async (req, res) => {
  //request body
  createNonStreamingMultipartContent(
    "appstore-384314",
    "us-central1",
    "gemini-1.0-pro-vision",
    req.body.image,
    "image/jpeg"
  );
  res.json(Utils.createSuccessResponseModel(0, "Success"));
};

async function createNonStreamingMultipartContent(
  projectId = "PROJECT_ID",
  location = "us-central1",
  model = "gemini-1.0-pro-vision",
  image = "gs://generativeai-downloads/images/scones.jpg",
  mimeType = "image/jpeg",
  text
) {
  const authOptions = {
    credentials: {
      client_email: "translate@appstore-384314.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCsWysoBpmJSfz2\nhMnjAJAyJ/oyo2+V6gDXFOKclfx1T+MDsn37ITlYK58MA35fiOjaCxuwBYOlec2Y\n3elrRKnUjKuiLxMc2IX5JE+Y7U0ydHRDffBnipvu8fazJn3SJvhp5xOtJ814CW2X\n+5RU57WXcjhfq9byfe7pvhHeWvmvks8h3ZnNLA38Vh6/nVkgfilIXUDyK3Ie4a6+\nzE7/idj+UinjFgvcM0Koi2UrdZ4IA1sqadT+cUs00R4MGdpm5dg3elkbX7hetbi2\ndEZ2XKNvI+LJK1Wjrom9hyvvFnkO6NKO1wXb45Hz0zUesYrHB406X9aNdOPgcZtU\ncGzfJJAtAgMBAAECggEAHDqdtw4G/+860RjO73DhrR1Sw2V0+rhF+p7Z6MHrWelu\nKeZbmjyG+wkV9m6XYvKhCfP6Im/Hb9xNugT/3Ij1SdyKUI4Q6CS8eKGjryKQBhIA\naCd3LvY1nkKfYG3kUKhU/79llR1+RR6XhmYhlXBn6Q3qQXJ7H4ypteXitlOZ2Sat\nFb5gR4g1GoIFVmKK+Ghp5yhpJWTruWifjMhE98TIs7YbAX+YqDWrf34TQ7szPPbQ\nYI7Kz/YpTJMOZij93tuOeRvNDpE8E495FHrdtYiYjkcqiHQFt2cfb//lMsC6RUeh\n4nRRklgOT25vI+Q8FlbbsCXvZHMcj3amSMLwX4OsvwKBgQDXQ21kKyUpN8+eecID\ndhXcKnYPqLfwqqOpMw7FAmydpvTLjU1wH9906ir8Bal0OHRe3z5xH2GJhtActJFK\noF90dBEnhodXNOgVtnR5PIAGgbLLSX0y047iNJrCvdPIzAgIMKO0vkrFuHF5QSMx\nFKeN19Qo6zFPYYKC2sMlc3G+ewKBgQDM+RJQ8XJ4DxzcqlS6zU94WtX8TydXqUzC\nA2xP/zoSJxnrhQMETkveYQbTHfSrQ4DRi78tuuv3uMSCxAlt7qVk/+Q5Ft0QBvEM\n4+3k1fSeo8a7qYP1H1tJaZ/kWW/ybKhHRXmrUtzGJ4+LLiG2AnzjFDtW08SmrPF2\ndzDwT3J/dwKBgQCIZYsM62GyilCdw9yxQMN9K9J+/ZL/hcAJ1/ZF0tFr23xE9hXZ\nM/jtJetyoUvL/nGOI7p3B0FQWQHJDoj5VkDlkx3Dg7SCB13/VArdPv6IIOpfcQNJ\nj097+YUOXCWzl8SHG/q+7cyHF+WexS09Ti8U62rdOpmWCN0feOop8sphvQKBgQCt\nYyw5SGU6Zh5WE8fk1PQarUxCSHrRTqddnyOqcA4heO4WKsgohkrrbEwnnjlv/oQj\nvgEUoAAn5yZkL4yCb9N9InFeUZbijdyuuMhuQQbSg1wDNxwm6EWCTlUxBu8JtRyM\nXZrUcB3NiX2FkJp3qpcWR/ECO9Un4TfIrH67aZlDdQKBgQDIKCe9FsjTe6FpKI/1\nSAW18qIHuQgSF/6TXjHikwG7CfTYyZJ0VA3MGCWowmAd164Yz4HpL24SbiHbiHQ8\nKHQKyIzyRWE/aMVfxhAZgYKQXWVYtzACxpdpFhGjGC4erOFYFz+1lcfe/5Qs1I3O\n9wo+0aHjITfjCX55c8d4Nzs7cg==\n-----END PRIVATE KEY-----\n",
    },
  };
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({
    project: projectId,
    location: location,
    googleAuthOptions: authOptions,
  });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({
    model: model,
  });

  // For images, the SDK supports both Google Cloud Storage URI and base64 strings
  const filePart = {
    inline_data: {
      data: image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Tôi có các chủ đề sau, hãy chọn ra các chủ đề có nội dung liên quan với bức ảnh sau: ${text}. Trả lời theo định dạng sau đây. Ví dụ: 1. Tên chủ đề, 3. Tên chủ đề, 5. Tên chủ đề. Bạn cũng có thể đưa ra các chủ đề mới, nếu thấy nó phù hợp với nội dung của bức ảnh`,
  };

  const request = {
    contents: [{ role: "user", parts: [filePart, textPart] }],
  };

  // console.log("Prompt Text:");
  // console.log(request.contents[0].parts[1].text);

  // console.log("Non-Streaming Response Text:");
  // Create the response stream
  const responseStream = await generativeVisionModel.generateContentStream(
    request
  );

  // Wait for the response stream to complete
  const aggregatedResponse = await responseStream.response;

  // Select the text from the response
  const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

  return fullTextResponse;
}

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
  SummarizesContent: SummarizesContent,
  createNonStreamingMultipartContent: createNonStreamingMultipartContent,
};
