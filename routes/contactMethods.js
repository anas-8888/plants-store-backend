const express = require("express");
const { contactMethodsController } = require("../controllers/contactMethods.controller");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createContactMethod", isAdmin, contactMethodsController.createContactMethod);
router.get("/getAllContactMethods", contactMethodsController.getAllContactMethods);
router.get("/getContactMethodById/:id", contactMethodsController.getContactMethodById);
router.put("/updateContactMethod/:id", isAdmin, contactMethodsController.updateContactMethod);
router.delete("/deleteContactMethod/:id", isAdmin, contactMethodsController.deleteContactMethod);

module.exports = router;
