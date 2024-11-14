const express = require("express");
const {
  savePlant,
  findAllPlantsWithPhotos,
  findPlantById,
  findPlantsByCategory,
  findPlantsBySubcategory,
  updatePlant,
  updatePhotoPlant,
  deletePlant,
  deletePlantPhoto
} = require("../controllers/plant.controller");
const upload = require("../middleware/uploadPlants");
const uploadPlantPhoto = require("../middleware/uploadPlantPhoto");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const plant = express.Router();

plant.post("/createPlant", isAdmin, upload, savePlant);
plant.get("/findAllPlantsWithPhotos", findAllPlantsWithPhotos);
plant.get("/findPlantById/:id", findPlantById);
plant.get("/findPlantsBySubcategory/:subcategoryId", findPlantsBySubcategory);
plant.get("/findPlantsBycategory/:categoryId", findPlantsByCategory);
plant.put("/updatePlant/:id", isAdmin, upload, updatePlant);
plant.put("/updatePlantPhoto/:photoId", isAdmin, uploadPlantPhoto, updatePhotoPlant);
plant.delete("/deletePlant/:id", isAdmin, deletePlant);
plant.delete("/deletePlantPhoto/:photoId", isAdmin, deletePlantPhoto);

module.exports = plant;
