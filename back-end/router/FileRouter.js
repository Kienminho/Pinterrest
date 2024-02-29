const express = require("express");
const router = express.Router();
const AuthenticateService = require("../common/AuthenticateService");
const FileService = require("../common/FileService");
const FileController = require("../controller/FileController");

router.post(
  "/upload",
  AuthenticateService.authenticateToken,
  FileService.upload.single("file"),
  FileController.HandleUploadFile
);

router.get("/get-all-attachments", FileController.GetAllAttachments);
router.get("/get-attachment-by-id/:id", FileController.GetAttachmentById);

module.exports = router;
