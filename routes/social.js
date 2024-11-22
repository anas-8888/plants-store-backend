const express = require("express");
const { socialController } = require("../controllers/social.controller");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createSocial", isAdmin, socialController.createSocial);
router.get("/findAllSocials", socialController.findAllSocials);
router.get("/findSocialById/:id", socialController.findSocialById);
router.put("/updateSocial/:id", isAdmin, socialController.updateSocial);
router.delete("/deleteSocial/:id", isAdmin, socialController.deleteSocial);

module.exports = router;
