const express = require("express");
const plantPressController = require("../controllers/plantPress.controller");
const upload = require("../middleware/uploadPlantPress");
const { isAdmin } = require("../middleware/isAdmin");

const plantPress = express.Router();

plantPress.post("/createPlantPress", isAdmin, upload, plantPressController.createPlantPress);
plantPress.get("/findAllPlantPresses", plantPressController.getAllPlantPresses);
plantPress.get("/findPlantPressId/:id", plantPressController.getPlantPressById);
plantPress.put("/updatePlantPress/:id", isAdmin, upload, plantPressController.updatePlantPress);
plantPress.delete("/deletePlantPress/:id", isAdmin, plantPressController.deletePlantPress);

module.exports = plantPress;
