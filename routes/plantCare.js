const express = require("express");
const plantCareController = require("../controllers/plantCare.controller");
const upload = require("../middleware/uploadPlantCare");
const { isAdmin } = require("../middleware/isAdmin");

const plantCare = express.Router();

plantCare.post("/createPlantCare", isAdmin, upload, plantCareController.createPlantCare);
plantCare.get("/findAllPlantCares", plantCareController.getAllPlantCares);
plantCare.get("/findPlantCareId/:id", plantCareController.getPlantCareById);
plantCare.put("/updatePlantCare/:id", isAdmin, upload, plantCareController.updatePlantCare);
plantCare.delete("/deletePlantCare/:id", isAdmin, plantCareController.deletePlantCare);

module.exports = plantCare;
