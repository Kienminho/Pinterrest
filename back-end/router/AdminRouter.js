const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const AuthenticateService = require("../common/AuthenticateService");

router.get("/dashboard", AdminController.RenderDashboard);
router.get("/manager-user", AdminController.RenderUser);

module.exports = router;
