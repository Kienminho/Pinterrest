const express = require("express");
const router = express.Router();
const AuthenticateService = require("../common/AuthenticateService");
const FileService = require("../common/FileService");
const FileController = require("../controller/FileController");

router.post(
  "/upload",
  AuthenticateService.authenticateToken,
  FileService.uploadFiles,
  FileController.HandleUploadFiles
);

module.exports = router;
