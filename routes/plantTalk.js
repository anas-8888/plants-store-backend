const express = require("express");
const plantTalkController = require("../controllers/plantTalk.controller");
const upload = require("../middleware/uploadPlantTalk");
const { isAdmin } = require("../middleware/isAdmin");

const plantTalk = express.Router();

plantTalk.post("/createPlantTalk", isAdmin, upload, plantTalkController.createPlantTalk);
plantTalk.get("/findAllPlantTalks", plantTalkController.getAllPlantTalks);
plantTalk.get("/findPlantTalkId/:id", plantTalkController.getPlantTalkById);
plantTalk.put("/updatePlantTalk/:id", isAdmin, upload, plantTalkController.updatePlantTalk);
plantTalk.delete("/deletePlantTalk/:id", isAdmin, plantTalkController.deletePlantTalk);

module.exports = plantTalk;
