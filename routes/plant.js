const express = require("express");
const {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  findPlantsBySubcategory,
} = require("./../controllers/plant.controller");

const plant = express.Router();

plant.post("/createPlant", createPlant);
plant.get("/findAllPlants", getAllPlants);
plant.get("/findPlantById/:id", getPlantById);
plant.get("/findPlantsBySubcategory/:subcategory_id", findPlantsBySubcategory);
plant.put("/updatePlant/:id", updatePlant);
plant.delete("/deletePlant/:id", deletePlant);

module.exports = plant;
