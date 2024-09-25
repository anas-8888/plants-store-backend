const express = require("express");
const {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  deletePlantPhoto,
  findPlantsBySubcategory,
} = require("./../controllers/plant.controller");
const upload = require("../middleware/uploadPlants");

const plant = express.Router();

plant.post("/createPlant", upload.array("photos", 5), createPlant);
plant.get("/findAllPlants", getAllPlants);
plant.get("/findPlantById/:id", getPlantById);
plant.get("/findPlantsBySubcategory/:subcategory_id", findPlantsBySubcategory);
plant.put("/updatePlant/:id", upload.array("photos", 5), updatePlant);
plant.delete("/deletePlant/:id", deletePlant);
plant.delete("/deletePlantPhoto/:photo_id", deletePlantPhoto);

module.exports = plant;
