const express = require("express");
const { helpSupportController } = require("../controllers/helpSupport.controller");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createHelpSupport", isAdmin, helpSupportController.createHelpSupport);
router.get("/getAllHelpSupport", helpSupportController.getAllHelpSupport);
router.get("/getHelpSupportById/:id", helpSupportController.getHelpSupportById);
router.put("/updateHelpSupport/:id", isAdmin, helpSupportController.updateHelpSupport);
router.delete("/deleteHelpSupport/:id", isAdmin, helpSupportController.deleteHelpSupport);

module.exports = router;
