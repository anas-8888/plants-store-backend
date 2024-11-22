const express = require("express");
const { privacyPolicyController } = require("../controllers/privacyPolicies.controller");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createPrivacyPolicy", isAdmin, privacyPolicyController.createPrivacyPolicy);
router.get("/getAllPrivacyPolicies", privacyPolicyController.getAllPrivacyPolicies);
router.get("/getPrivacyPolicyById/:id", privacyPolicyController.getPrivacyPolicyById);
router.put("/updatePrivacyPolicy/:id", isAdmin, privacyPolicyController.updatePrivacyPolicy);
router.delete("/deletePrivacyPolicy/:id", isAdmin, privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
