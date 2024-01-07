const express = require("express");
const router = express.Router();

const AuthenticateService = require("../common/AuthenticateService");
const UserController = require("../controller/UserController");

router.post("/register", UserController.HandleRegister);
router.post("/login", UserController.HandleLogin);
router.get(
  "/logout",
  AuthenticateService.authenticateToken,
  UserController.HandleLogout
);
router.get("/user-by-email/:email", UserController.GetUserByEmail);
router.post("/verify", UserController.SendMail);

router.post(
  "/refresh-token",
  AuthenticateService.authenticateRefreshToken,
  UserController.GetAccessTokenByRefreshToken
);

router.post("/forgot-password", UserController.ForgotPassword);
module.exports = router;
