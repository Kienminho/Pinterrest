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
      client_email: "configai@pinspried.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH789WDDkgxD/z\n3iNLNJ/336zsUxDbL8/q2GxcACb7gWIjisq9syaJ2l3Vpac7TCT4x+sOy8c20iel\nKEopCfC2lwc3YAJYS9NhOkq1hWt/LtRN1jwDh5Q32E6MFTw21e1z3E1bStPfu/xU\nq22fYn6a3TX4YAEg549lJ+XcjNXIf5TIob952pG4eU116JHPRE8jvCH3Z/LVvtGx\ng0SEh0BWmgxsKexPPOLSe2e2BbssKYcVultawGLaLvCSxmDbSs80p3jbf3n0IwDK\n0xXBkmSz1eSWhZbbgHQGDiDa0XUJVwilyXoYvj2bi88chTqOHer5iaashASwskfe\n+kvtzH5PAgMBAAECggEAKaO/KauYBkP5EcAU16fZHRWffQR7wTp+8ekrACoj9ENo\n/f/84285OoKZAlLitk3QcWOph8ZW8groqNPwRgXE9TIVFapQMrVwC5LJVm64CZ/m\nJWPV0eJdsxfAnBocFUuOjY+3KKk34SPUlImzZftsZLJneBf+hCzVx3p8u+c06vGQ\n4FOA8hAWBVjuzdoixD4t5qFx6meCgGCUI/ZiFTMyd0Ss7bhpLSxgipXYusZZlzzw\nhIk2A4Avw7vMG+6E7ctrpeFhnxJ5G/jlfVxZwuxiIMlKpfz5iol0STjX9OLOHbqq\nc/Tdw4tz/9BGuukQPWMt8p9fFfF3pTd8DA9zfO5NOQKBgQDtqfLHup6UWDdYWHZB\nWxpK9ZwqIvdN2qbafi3teBgbBJblHsI2N8DvsE3honbaZwobMIZqBKhveGkwGR51\nlJ8jrk8MTkGBG0cUHiI4rLthjYkpb4pFmykQcldwTnsjTK92yck4f8Iww6c+aUk4\nCL+D2FHd05SPqsUcvbGHU5JvbQKBgQDXXLiVn74UWAscu0w6Y8DxWk6ymr0dPwHm\nH1kz8funI+0hXjkMZUrQgr61KTN0YxgceUR5pCbuho+k1YLEIGIVBXkDMOedwoVI\nN7G5XWw3BoAiCsxvs48sKMPHJ3jeIkwTJrf+qyx8kUpOW1kPXD9zAYh6Z3OU7tXe\nXtT6KYuDKwKBgQCxjmBlO1UyOt3OUPi4RxnTmr8687iTH6G8ZrxlR22q8bjSIDK0\nUt7/s1XcFoZ5ELYKLiydlDFKZkkfuAR7j7d87sL7zJM/o2Ns8j5a3SF49kbdAAnr\nisoZEXOl4dw5ORd1xbdhUIGB8QpHpF0hUdfS5o/zDBlXZBuzJz00fwlN2QKBgBmj\nZi4Z2E0ftiLzgT2qRnv1Hk1Q8paau6UjskDm2+in9ED2sJ/zJxbvmbiDcSa37VTm\ncupwSlo3Fr6u1GR43nRWNHPWzJwRXkCcsMG6h3l9gp+K3Y+mtrKxH62D23XGa3wU\nLe9ZfXBO86OkaFPVzY/pbM/1pOLkE/3nGD+31m4FAoGAVtCOlVKFmRo0gegQMzaF\nsLymEl5eeM7UxZWjxHUejQgoxkxO19QRJNKC/mR1CIkPUjoFFg4mjIp3OA69IP/k\nWF6OOLECRqKrzWPFMHTt0gknY8YU3SZ0FKlOv8VLRzC05qEFNNdI/Pf6LgYIiHGp\nIvIflXaLrtB+8UorgZzltW8=\n-----END PRIVATE KEY-----\n",
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
