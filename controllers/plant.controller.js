const plantRepository = require("../repositories/plant.repository");
const plantPhotoRepository = require("../repositories/plant_photo.repository");
const validator = require("validator");
const fs = require("fs");

// Create plant with photos
async function savePlant(req, res) {
  try {
    const plantData = req.body;

    // Validate input
    if (!validator.isNumeric(plantData.price) || plantData.price <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    if (!validator.isNumeric(plantData.quantity) || plantData.quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }
    if (!plantData.category_id || !validator.isNumeric(plantData.category_id)) {
      return res.status(400).json({ error: "Invalid or missing category ID" });
    }

    const result = await plantRepository.savePlant(plantData);

    // Save photos if any
    if (req.files && req.files.length > 0) {
      await plantPhotoRepository.savePlantPhotos(result.insertId, req.files);
    }

    res.status(201).json({ success: true, plantId: result.insertId });
  } catch (error) {
    console.error("Error saving plant:", error);
    res.status(500).json({ error: "Could not save plant" });
  }
}


// Find all plants with photos
async function findAllPlantsWithPhotos(req, res) {
  try {
    const plants = await plantRepository.findAllPlantsWithPhotos();
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      if (language === "ar") {
        return {
          id: plant.id,
          plant_name: plant.plant_name_AR,
          description: plant.description_AR,
          price: plant.price,
          pot: plant.pot_AR,
          quantity: plant.quantity,
          water: plant.water_AR,
          light: plant.light_AR,
          temperatures: plant.temperatures_AR,
          easy: plant.easy_AR,
          part_sun: plant.part_sun_AR,
          medium: plant.medium_AR,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          category_id: plant.category_id,
          photos: plant.photos[0],
        };
      } else {
        return {
          id: plant.id,
          plant_name: plant.plant_name_EN,
          description: plant.description_EN,
          price: plant.price,
          pot: plant.pot_EN,
          quantity: plant.quantity,
          water: plant.water_EN,
          light: plant.light_EN,
          temperatures: plant.temperatures_EN,
          easy: plant.easy_EN,
          part_sun: plant.part_sun_EN,
          medium: plant.medium_EN,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          category_id: plant.category_id,
          photos: plant.photos[0],
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants with photos:", error);
    res.status(500).json({ error: "Could not fetch plants with photos" });
  }
}

// Find plant by ID with language filtering
async function findPlantById(req, res) {
  const { id } = req.params;
  try {
    const plants = await plantRepository.findPlantById(id);
    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const language = req.language;
    const filteredPlants = plants.map((plant) => {
      const photoPaths = plant.photos.filter((photoPath) => true);

      if (language === "ar") {
        return {
          id: plant.id,
          plant_name: plant.plant_name_AR,
          description: plant.description_AR,
          price: plant.price,
          pot: plant.pot_AR,
          quantity: plant.quantity,
          water: plant.water_AR,
          light: plant.light_AR,
          temperatures: plant.temperatures_AR,
          easy: plant.easy_AR,
          part_sun: plant.part_sun_AR,
          medium: plant.medium_AR,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          category_id: plant.category_id,
          photos: photoPaths,
        };
      } else {
        return {
          id: plant.id,
          plant_name: plant.plant_name_EN,
          description: plant.description_EN,
          price: plant.price,
          pot: plant.pot_EN,
          quantity: plant.quantity,
          water: plant.water_EN,
          light: plant.light_EN,
          temperatures: plant.temperatures_EN,
          easy: plant.easy_EN,
          part_sun: plant.part_sun_EN,
          medium: plant.medium_EN,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          category_id: plant.category_id,
          photos: photoPaths,
        };
      }
    });
    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ error: "Could not fetch plant" });
  }
}

async function findPlantsByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const plants = await plantRepository.findPlantsByCategory(categoryId);
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      if (language === "ar") {
        return {
          id: plant.id,
          plant_name: plant.plant_name_AR,
          description: plant.description_AR,
          price: plant.price,
          pot: plant.pot_AR,
          quantity: plant.quantity,
          water: plant.water_AR,
          light: plant.light_AR,
          temperatures: plant.temperatures_AR,
          easy: plant.easy_AR,
          part_sun: plant.part_sun_AR,
          medium: plant.medium_AR,
          newest: plant.newest,
          recommended: plant.recommended,
          category_id: plant.category_id,
          photos: plant.photos[0],
        };
      } else {
        return {
          id: plant.id,
          plant_name: plant.plant_name_EN,
          description: plant.description_EN,
          price: plant.price,
          pot: plant.pot_EN,
          quantity: plant.quantity,
          water: plant.water_EN,
          light: plant.light_EN,
          temperatures: plant.temperatures_EN,
          easy: plant.easy_EN,
          part_sun: plant.part_sun_EN,
          medium: plant.medium_EN,
          newest: plant.newest,
          recommended: plant.recommended,
          category_id: plant.category_id,
          photos: plant.photos[0],
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants by category:", error);
    res.status(500).json({ error: "Could not fetch plants by category" });
  }
}

async function findPlantsBySubcategory(req, res) {
  try {
    const { subcategoryId } = req.params;
    const plants = await plantRepository.findPlantsBySubcategory(subcategoryId);
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      if (language === "ar") {
        return {
          id: plant.id,
          plant_name: plant.plant_name_AR,
          description: plant.description_AR,
          price: plant.price,
          pot: plant.pot_AR,
          quantity: plant.quantity,
          water: plant.water_AR,
          light: plant.light_AR,
          temperatures: plant.temperatures_AR,
          easy: plant.easy_AR,
          part_sun: plant.part_sun_AR,
          medium: plant.medium_AR,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          photos: plant.photos[0],
        };
      } else {
        return {
          id: plant.id,
          plant_name: plant.plant_name_EN,
          description: plant.description_EN,
          price: plant.price,
          pot: plant.pot_EN,
          quantity: plant.quantity,
          water: plant.water_EN,
          light: plant.light_EN,
          temperatures: plant.temperatures_EN,
          easy: plant.easy_EN,
          part_sun: plant.part_sun_EN,
          medium: plant.medium_EN,
          newest: plant.newest,
          recommended: plant.recommended,
          subcategory_id: plant.subcategory_id,
          photos: plant.photos[0],
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants by subcategory:", error);
    res.status(500).json({ error: "Could not fetch plants by subcategory" });
  }
}

// Update plant
async function updatePlant(req, res) {
  const plantId = req.params.id;

  const {
    plant_name_EN,
    plant_name_AR,
    description_EN,
    description_AR,
    price,
    pot_EN,
    pot_AR,
    quantity,
    water_EN,
    water_AR,
    light_EN,
    light_AR,
    temperatures_EN,
    temperatures_AR,
    easy_EN,
    easy_AR,
    part_sun_EN,
    part_sun_AR,
    medium_EN,
    medium_AR,
    newest,
    recommended,
    subcategory_id,
    category_id,
  } = req.body;

  try {
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: "Plant ID is missing or invalid.",
      });
    }

    const existingPlant = (await plantRepository.findPlantById(plantId))[0];
    if (!existingPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found.",
      });
    }

    const updatedData = {
      id: plantId,
      plant_name_EN: plant_name_EN || existingPlant.plant_name_EN,
      plant_name_AR: plant_name_AR || existingPlant.plant_name_AR,
      description_EN: description_EN || existingPlant.description_EN,
      description_AR: description_AR || existingPlant.description_AR,
      price: price || existingPlant.price,
      pot_EN: pot_EN || existingPlant.pot_EN,
      pot_AR: pot_AR || existingPlant.pot_AR,
      quantity: quantity || existingPlant.quantity,
      water_EN: water_EN || existingPlant.water_EN,
      water_AR: water_AR || existingPlant.water_AR,
      light_EN: light_EN || existingPlant.light_EN,
      light_AR: light_AR || existingPlant.light_AR,
      temperatures_EN: temperatures_EN || existingPlant.temperatures_EN,
      temperatures_AR: temperatures_AR || existingPlant.temperatures_AR,
      easy_EN: easy_EN || existingPlant.easy_EN,
      easy_AR: easy_AR || existingPlant.easy_AR,
      part_sun_EN: part_sun_EN || existingPlant.part_sun_EN,
      part_sun_AR: part_sun_AR || existingPlant.part_sun_AR,
      medium_EN: medium_EN || existingPlant.medium_EN,
      medium_AR: medium_AR || existingPlant.medium_AR,
      newest: newest || existingPlant.newest,
      recommended: recommended || existingPlant.recommended,
      subcategory_id: subcategory_id || existingPlant.subcategory_id,
      category_id: category_id || existingPlant.category_id,
    };

    const plantUpdateResult = await plantRepository.updatePlant(updatedData);

    res.status(200).json({
      success: true,
      message: plantUpdateResult.message,
      updatedPlant: plantUpdateResult,
    });
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating plant",
    });
  }
}

// Update plant photo
async function updatePhotoPlant(req, res) {
  const { photoId } = req.params;
  const photoPath = req.file
    ? `uploads/plants/${req.file.filename}`
    : null;

  try {
    if (!photoId) {
      return res.status(400).json({ error: "Photo id is required!" });
    }
    if (!photoPath) {
      return res.status(400).json({ error: "Photo is required!" });
    }

    // Find the existing photo
    const existingPhoto = await plantPhotoRepository.findPhotoById(photoId);
    if (!existingPhoto) {
      return res.status(404).json({ error: "Photo not found!" });
    }

    // Update photo in the database by deleting the old record and adding a new one
    await plantPhotoRepository.updatePlantPhoto({
      photoId,
      plant_id: existingPhoto.plant_id,
      photoPath,
    });

    return res.status(200).json({
      message: "Plant photo updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update plant photo",
      details: error.message,
    });
  }
}

//Delete Plant
async function deletePlant(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Plant ID is missing or invalid.",
      });
    }

    const plantExsist = (await plantRepository.findPlantById(id))[0];
    if (!plantExsist) {
      return res.status(404).json({ error: "Plant not found" });
    }

    await plantPhotoRepository.deletePlantPhoto(id);
    await plantRepository.deletePlant(id);
    res.status(204).json({
      message: "plant deleted succsesfuly"
    });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ error: "Could not delete plant" });
  }
}

async function deletePlantPhoto(req, res) {
  const { photoId } = req.params;

  try {
    // Fetch photo data by ID
    const photo = await plantPhotoRepository.findPhotoById(photoId);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found!" });
    }
    
    // Delete the photo record from the database
    await plantPhotoRepository.deletePlantPhoto(photoId);

    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant photo:", error.message);
    return res.status(500).json({
      error: "Failed to delete plant photo",
      details: error.message,
    });
  }
}

module.exports = {
  savePlant,
  findAllPlantsWithPhotos,
  findPlantById,
  findPlantsByCategory,
  findPlantsBySubcategory,
  updatePlant,
  updatePhotoPlant,
  deletePlant,
  deletePlantPhoto
};
