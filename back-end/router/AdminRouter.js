const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");

router.get("/dashboard", AdminController.RenderDashboard);
router.get("/manager-user", AdminController.RenderUser);
router.get("/manager-attachment", AdminController.RenderAttachment);
router.get("/manager-categories", AdminController.RenderCategory);
router.get("/manager-post", AdminController.RenderPost);

module.exports = router;
