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
    "pinterest-417305",
    "us-central1",
    "gemini-1.0-pro-vision",
    req.body.image,
    "image/jpeg"
  );
  res.json(Utils.createSuccessResponseModel(0, "Success"));
};

async function createNonStreamingMultipartContent(
  projectId = "pinterest-417305",
  location = "us-central1",
  model = "gemini-1.0-pro-vision",
  image = "gs://generativeai-downloads/images/scones.jpg",
  mimeType = "image/jpeg",
  text
) {
  const authOptions = {
    credentials: {
      client_email: "test-66@pinterest-417305.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3buI7I/09L4pT\nxvKp9QkFlUY6snjj94cn/r6k86lyavJfpb9TVnIyzTxy7FMLHiL8cl3yzK7JEO9/\npfyNODP0B+mJBZR6dYQK8k3CVUaak55JpT4B31Gzjf+pOBUfPxTyKw5YCVZIFFq3\n2DsxLE41Gn/fniG+7P3MJxpxNlh01CJzMjYCtF/AItwcReKXe00cB7/bq5i3RS8i\nR7/0Z2l5dAvbMIIsnE+Gt//yCfeAisYwDd+OuGFmqYTXZ72JgsBB5m8IdvTpx9Mz\n3HSroH/tDtZWhKNkmaJQppmaX7HWgobAm875DFwcqN2AVnZLaKZc/F3cmMfQS+Bg\ncp//6u0fAgMBAAECggEAA8oaVo8JefYDw6cbBHbUi/uuLgoM14AAGBi6EIdPuCNM\nd++UWPp/gaj3kQcGNvcVUVjKTXjibX+LkXwFqfDMzF0Z4bCuhUWGbk5C9ZS0ajIX\nG/D6RUI7TY9nH83rf2NBIZ83fL5PCYGRV2knELHlH1GGVCgDDQ7+HHV8WHVlqDgt\nIkNgjt//O65d6KNgUUeueKg6wyU3fAAy4OoED2+KerpsI0hfwHa7N0yyk1MjG0w+\nBQDmcny4JfOzDJgeod+wPGznBrLLgHl6HiPbVY9sp/AOBf3QKXnc2u+aRMiAY+Sk\nYRQhMWsyEUwVMGt5VCxhcbB74G6HClmifAwzaHPoQQKBgQDeqhHkgsipL7sm/QXM\nKWVNwfF2S7oA68xQiV/W07mtZWoikZGRbAmtFBa7fQETEktqvb+JfJjSX4ToN+TX\nCaDem41peMAabNhpnu7BttrhGXe/zjmB/5onhgNeoVZ/GSZYX3Hn1Lrjwxs/33Zl\nMTZjrLwbhqYe9SX3pD3qif2LXwKBgQDS5TjRzUOsVrwUFCxC2p62xj4ayazCztdN\nOkB2lxBDX47rQMnWQScWdqek7FzlaENho8kPhrMTKjCn/Psr20gFvkJvd4HyqJ4R\n+edjdlb3OuwWnkIQMKLXf9gduWo9ppt0JbusMgdoo2sl/q+/LrXIml5nykpEZngs\nOO2Vg6u2QQKBgECPWyTAbuHvPvps/pNVpVPIWfSMvF+r/s+TJUCqnvmRoBZp0qUx\niBSw8G5oLjmTYl6Oqcx5Xe4RV/3kxus6lXQ18eiU5E5FJPJq7JsqI4iE092/M5ln\nvRCcoLl9WhD7/8w70FEBszZ6yZnZdwCcJkL8QIZSojPzrJCDBJjObb9NAoGABtJz\nbBX/wmtr2hps9ByuVatEBwnPFN4sCMuBmlR4qjVFIkcOQGgLI6bi9WrP9nvQ8i+i\nKWZqFIyg1k5QsbJ+OfFVpNVw1rCtrFcxLP5/AbBeQr0L1go8ukvgadW9ohDppnAy\nCff0VWYz6R68AKs6JisYMrNQg7Xs3UFaLiP8QgECgYATPbZb4LxamrCuARLCn6mC\ngHu9mnzpZDNpXuHYH9qPPD3B5BtaM3ERMVtBb5sbIzWpW/6Kbyv5HHBofXba9Ide\n7ZLrqdQj++RU9kSIK8sFsF1SrFQL+/85Rba8dhZyp4tldKy1vzOQiwQwc5cIapM1\nRb0gKMLQtE4g2bYhV9TE6w==\n-----END PRIVATE KEY-----\n",
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
