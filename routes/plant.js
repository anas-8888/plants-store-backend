const express = require("express");
const {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  findPlantsBySubcategory,
} = require("./../controllers/plant.controller");
const upload = require("../middleware/uploadPlants");

const plant = express.Router();

plant.post("/createPlant", upload.single("photo"), createPlant);
plant.get("/findAllPlants", getAllPlants);
plant.get("/findPlantById/:id", getPlantById);
plant.get("/findPlantsBySubcategory/:subcategory_id", findPlantsBySubcategory);
plant.put("/updatePlant/:id", upload.single("photo"), updatePlant);
plant.delete("/deletePlant/:id", deletePlant);

module.exports = plant;
