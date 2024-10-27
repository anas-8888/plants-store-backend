const express = require("express");
const {
  savePlant,
  findAllPlantsWithPhotos,
  findPlantById,
  findPlantsBySubcategory,
  updatePlantAndPhotos,
  deletePlant,
} = require("../controllers/plant.controller");
const upload = require("../middleware/uploadPlants");

const plant = express.Router();

plant.post("/createPlant", upload, savePlant);
plant.get("/findAllPlantsWithPhotos", findAllPlantsWithPhotos);
plant.get("/findPlantById/:id", findPlantById);
plant.get("/findPlantsBySubcategory/:subcategoryId", findPlantsBySubcategory);
plant.put("/updatePlant/:id", upload, updatePlantAndPhotos);
plant.delete("/deletePlant/:id", deletePlant);

module.exports = plant;
