const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadAboutUs");
const aboutUsController = require("../controllers/aboutUs.controller");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/createAboutUs", isAdmin, upload, aboutUsController.createAboutUs);
router.get("/getAllAboutUs", aboutUsController.getAllAboutUs);
router.get("/getAboutUsById/:id", aboutUsController.getAboutUsById);
router.put("/updateAboutUs/:id", isAdmin, upload, aboutUsController.updateAboutUs);
router.delete("/deleteAboutUs/:id", isAdmin, aboutUsController.deleteAboutUs);

module.exports = router;
