const express = require("express");
const { messageController } = require("./../controllers/message.controller");
const { validateMessage } = require("../middleware/validateMessage");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/sendMessage", validateMessage, messageController.sendMessage);
router.get("/findAllMessages", isAdmin, messageController.findAllMessages);
router.get("/findMessageById/:id", isAdmin, messageController.findMessageById);

module.exports = router;
