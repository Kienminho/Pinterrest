const { Translate } = require("@google-cloud/translate").v2;
const { VertexAI } = require("@google-cloud/vertexai");
const axios = require("axios");
const fs = require("fs");

const _FileService = require("../../common/FileService");
const _FileController = require("./FileController");
const Utils = require("../../common/Utils");
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
        "Bearer sk-cpGEGtz6Fkb0wSwnLXvnezsOuv6MvfAkF45lEzH8MpOxUE9M",
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
    "pinspried",
    "us-central1",
    "gemini-1.0-pro-vision",
    req.body.image,
    "image/jpeg"
  );
  res.json(Utils.createSuccessResponseModel(0, "Success"));
};

async function createNonStreamingMultipartContent(
  projectId = "pinspried",
  location = "us-central1",
  model = "gemini-1.0-pro-vision",
  image = "gs://generativeai-downloads/images/scones.jpg",
  mimeType = "image/jpeg",
  text
) {
  const authOptions = {
    credentials: {
      client_email: "config-api-gg@pinspried.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCMHYyksV5hHwAD\nsXBj8Fv7WSlZi82vj1aUUQfHObqKrCXwRS6318piLmoYUTP6/V8kbN3RtuzQfQ8K\nnUenUXK1mE3qs+Z9jGTHoHzgFEQsCmE3zAWpPzfx4GkS+S05yzR2XKkyv/vWKPgK\n8VScxeEdLSX3BZA03TZH9MEJpMhslg7VB7qxiSsqaGSvpmxyZymwDc/ycFnPlFfv\nYzsK64xYZT9M7lOTH6U1ieO8jX+mV4oAvYTAc27b5Ryu0xhe0HBwvnJ90vckOI5E\neKnVTFGOV+ZZbRwr6Fqik5rcNQgU/7xKlQwBFZfb57D6tp9e7zut5enzCVYsckso\nqM4nsqNdAgMBAAECggEABojSQe2e4y4/VLmPuxMLylSsLJrsHfkajPkCdEFPxWvZ\nERpVq9YKgDp96pU1TjB6B9VAuw925K12zoRRqFuQdMIEadYeAVKGckqC+5UcxzKf\n7UQ8kPOvBKUpZ7mEz6JkcSiwU2EuU4LxnnQ6AZDqhyI15Q4c9y1h4xUzc3ziqmQV\nFb/7FmbVrjmt6SSn3MnpCCQ8V37rxb7lQYKk3gOsEVz1IlH16PtaX7ShndRSDz4D\nLtej/C9dNG6l5KAQOhNWYirgCU/s1YVFfnhSg5dv/WQJMYtvSnoXxRIqhOZ38Vbi\nbzET9x8ahQ5UFfKJ1v8+fzoU0sZKfnIz+RAiD5ZKQQKBgQDDzv970MFcdGJMfnqq\nC5/pjdQYGwMTxk4JitCv2Wss14fDIA9O7SxSVvLohwB0m/mra+WkvAIDpy1GVAdD\nma5wkrekQRH33Pu5InyQijbG/oVUPHpFrOdgIvK4ZAomHVrQUdtDsU8prPN1nbY/\n4D+J0yG0w1vemHPR/2TvLSuu9QKBgQC3L9KAv1EqL+316ogceMnpjm+eRHEe6lQX\nv4rwuII+DBYywz5ZiLrsoPWvc+f7GJDtN8TGmlM3XBBCXRyR89byX5Rfy1B689ay\nLUHfASVj1FXBQQvUF1y5TcfZmihmWwv2wNlp0KyHXVowFUBzEPjgDMWtfhU4uxnp\nOYn3dagRyQKBgCa35L737XQ5s0JK9DhxqgJFwD2wAbDEUqQCZfePt2ibicXkrgI+\nVbhGZyvhng5w1TK3WCZ14rQUN5ijfvg4CE1MRbHeCA6KDOBz2EvAeMpqg7S/bLIg\nWXQiFPqvFW6p+U4eEYxWIEAuacnFEMeasRWwwQZ8ZssiPCy3Ip9EwFGNAoGAN9pe\n5l5u0twWQ9qkcXnqpkmFgs3/Z5uu1CbUqBy5qU1qH0QkaIwl4iwZfMtsOcT9uzY7\nywoWwVRSqMlXArFEIlY+GQ8WlMZv+ZeO8/2Xdt6w3uGER8BvxxgODSzRkJPGDBA0\nueykDgnKi8qPAgZ0u2tpgkJlGg0CE3g1truq6PECgYEAsLsVxj9dhOp/bQzNgY5q\nr22Uj5eCGlKdOSxe72dkk1j/PqK0cJzYucxBVsyE9TfA9E5KuRkkxOndlhkkfl04\nvahmEg7SP/wbnGShz4b45teOGc/XhqzTS7eu3cVayLgzxliXQHx+KHBrxZJx2+56\nY34WT1O06kllX1STSn7J6sQ=\n-----END PRIVATE KEY-----\n",
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
    text: `Tôi có các chủ đề sau, hãy chọn ra các chủ đề có nội dung liên quan với bức ảnh sau: ${text}. Trả lời theo định dạng sau đây. Ví dụ: 1. Tên chủ đề\n, 3. Tên chủ đề\n, 5. Tên chủ đề\n,..... Bạn cũng có thể đưa ra các chủ đề mới, nếu thấy nó phù hợp với nội dung của bức ảnh`,
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
