const express = require("express");
const router = express.Router();
const AuthenticateService = require("../../common/AuthenticateService");
const UserController = require("../../controller/API/UserController");

router.post("/register", UserController.HandleRegister);
router.post("/login", UserController.HandleLogin);
router.get(
  "/logout",
  AuthenticateService.authenticateToken,
  UserController.HandleLogout
);
router.get("/google", UserController.AuthenticateGoogle);
router.get("/google/callback", UserController.AuthenticateGoogleCallback);

router.get(
  "/user-by-email/:email",
  AuthenticateService.authenticateToken,
  UserController.GetUserByEmail
);
router.post("/verify", UserController.SendMail);

router.post(
  "/refresh-token",
  AuthenticateService.authenticateRefreshToken,
  UserController.GetAccessTokenByRefreshToken
);

router.post("/forgot-password", UserController.ForgotPassword);
router.put(
  "/update-info",
  AuthenticateService.authenticateToken,
  UserController.UpdateInfo
);

//update avatar
router.put(
  "/update-avatar",
  AuthenticateService.authenticateToken,
  UserController.UpdateAvatar
);

router.post(
  "/follow",
  AuthenticateService.authenticateToken,
  UserController.HandleFollow
);

router.delete(
  "/un-follow/:id",
  AuthenticateService.authenticateToken,
  UserController.HandleUnFollow
);

//get following list of user
router.get(
  "/get-following",
  AuthenticateService.authenticateToken,
  UserController.GetFollowing
);

//get follower list of user
router.get(
  "/get-follower",
  AuthenticateService.authenticateToken,
  UserController.GetFollower
);

router.get(
  "/search",
  AuthenticateService.authenticateToken,
  UserController.SearchUser
);
module.exports = router;
