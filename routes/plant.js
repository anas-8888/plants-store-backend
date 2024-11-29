const express = require("express");
const {
  savePlant,
  findAllActivePlantsWithPhotos,
  findAllPlantsWithPhotos,
  findActivePlantById,
  findPlantById,
  findPlantByName,
  findPlantsByCategory,
  findPlantsBySubcategory,
  findAllNewestPlants,
  updatePlant,
  updatePhotoPlant,
  deletePlant,
  deletePlantPhoto
} = require("../controllers/plant.controller");
const upload = require("../middleware/uploadPlants");
const uploadPlantPhoto = require("../middleware/uploadPlantPhoto");
const { isAdmin } = require("../middleware/isAdmin");

const plant = express.Router();

plant.post("/createPlant", isAdmin, upload, savePlant);
plant.get("/findAllActivePlantsWithPhotos", findAllActivePlantsWithPhotos);
plant.get("/findAllPlantsWithPhotos", isAdmin, findAllPlantsWithPhotos);
plant.get("/findActivePlantById/:id", findActivePlantById);
plant.get("/findPlantById/:id", isAdmin, findPlantById);
plant.get("/findPlantByName/:name", findPlantByName);
plant.get("/findPlantsBySubcategory/:subcategoryId", findPlantsBySubcategory);
plant.get("/findPlantsBycategory/:categoryId", findPlantsByCategory);
plant.get("/findAllNewestPlants", findAllNewestPlants);
plant.put("/updatePlant/:id", isAdmin, upload, updatePlant);
plant.put("/updatePlantPhoto/:photoId", isAdmin, uploadPlantPhoto, updatePhotoPlant);
plant.delete("/deletePlant/:id", isAdmin, deletePlant);
plant.delete("/deletePlantPhoto/:photoId", isAdmin, deletePlantPhoto);

module.exports = plant;
