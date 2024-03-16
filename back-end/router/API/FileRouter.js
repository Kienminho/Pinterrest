const express = require("express");
const router = express.Router();
const AuthenticateService = require("../../common/AuthenticateService");
const FileService = require("../../common/FileService");
const FileController = require("../../controller/API/FileController");

router.post(
  "/upload",
  AuthenticateService.authenticateToken,
  FileService.upload.single("file"),
  FileController.HandleUploadFile
);
router.post(
  "/upload-images",
  AuthenticateService.authenticateToken,
  FileService.upload.single("file"),
  FileController.UploadImages
);

router.get("/get-all-attachments", FileController.GetAllAttachments);
router.get("/get-attachment-by-id/:id", FileController.GetAttachmentById);
router.delete(
  "/delete-attachment/:id",
  AuthenticateService.authenticateToken,
  FileController.RemoveAttachment
);

module.exports = router;
