const plantRepository = require("../repositories/plant.repository");
const plantPhotoRepository = require("../repositories/plant_photo.repository");
const validator = require("validator");

// Create plant with photos
async function savePlant(req, res) {
  try {
    const plantData = req.body;

    // Validate input
    if (!plantData.category_id || !validator.isNumeric(String(plantData.category_id))) {
      return res.status(400).json({ error: "Invalid or missing category ID" });
    }
    if (!validator.isNumeric(String(plantData.quantity)) || plantData.quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const sizes = ["size1", "size2", "size3", "size4"];
    const prices = ["price1", "price2", "price3", "price4"];

    for (let i = 0; i < 4; i++) {
      if (plantData[`${sizes[i]}_EN`] || plantData[`${sizes[i]}_AR`]) {
        if (!plantData[`${sizes[i]}_EN`] || !plantData[`${sizes[i]}_AR`]) {
          return res.status(400).json({ error: `Missing size ${i + 1} translation` });
        }
        if (!validator.isNumeric(String(plantData[prices[i]])) || plantData[prices[i]] <= 0) {
          return res.status(400).json({ error: `Invalid ${prices[i]}` });
        }
      }
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

// Find all active plants with photos
async function findAllActivePlantsWithPhotos(req, res) {
  try {
    const plants = await plantRepository.findAllActivePlantsWithPhotos();
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        category_id: plant.category_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants with photos:", error);
    res.status(500).json({ error: "Could not fetch plants with photos" });
  }
}

// Find all plants with photos
async function findAllPlantsWithPhotos(req, res) {
  try {
    const plants = await plantRepository.findAllPlantsWithPhotos();
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        category_id: plant.category_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants with photos:", error);
    res.status(500).json({ error: "Could not fetch plants with photos" });
  }
}

// Find active plant by ID
async function findActivePlantById(req, res) {
  const { id } = req.params;
  try {
    const plants = await plantRepository.findActivePlantById(id);
    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const language = req.language;
    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        category_id: plant.category_id,
        photos: plant.photos,
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });
    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ error: "Could not fetch plant" });
  }
}

// Find plant by ID
async function findPlantById(req, res) {
  const { id } = req.params;
  try {
    const plants = await plantRepository.findPlantById(id);
    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const language = req.language;
    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        category_id: plant.category_id,
        photos: plant.photos,
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });
    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ error: "Could not fetch plant" });
  }
}

// Find plants by category
async function findPlantsByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const plants = await plantRepository.findPlantsByCategory(categoryId);
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        category_id: plant.category_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants by category:", error);
    res.status(500).json({ error: "Could not fetch plants by category" });
  }
}

// Find plants by subcategory
async function findPlantsBySubcategory(req, res) {
  try {
    const { subcategoryId } = req.params;
    const plants = await plantRepository.findPlantsBySubcategory(subcategoryId);
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants by subcategory:", error);
    res.status(500).json({ error: "Could not fetch plants by subcategory" });
  }
}

// Find all newest plants
async function findAllNewestPlants(req, res) {
  try {
    const plants = await plantRepository.findAllNewestPlants();
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        category_id: plant.category_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching newest plants:", error);
    res.status(500).json({ error: "Could not fetch newest plants" });
  }
}

// Find plant by name
async function findPlantByName(req, res) {
  const { name } = req.params;
  try {
    const plants = await plantRepository.findPlantByName(name);
    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const language = req.language;
    const filteredPlants = plants.map((plant) => {
      const commonData = {
        id: plant.id,
        is_active: plant.is_active,
        price1: plant.price1,
        price2: plant.price2,
        price3: plant.price3,
        price4: plant.price4,
        quantity: plant.quantity,
        newest: plant.newest,
        recommended: plant.recommended,
        subcategory_id: plant.subcategory_id,
        category_id: plant.category_id,
        photos: plant.photos[0],
      };

      return language === "ar" ? {
        ...commonData,
        plant_name: plant.plant_name_AR,
        description: plant.description_AR,
        pot: plant.pot_AR,
        water: plant.water_AR,
        light: plant.light_AR,
        temperatures: plant.temperatures_AR,
        easy: plant.easy_AR,
        part_sun: plant.part_sun_AR,
        medium: plant.medium_AR,
        size1: plant.size1_AR,
        size2: plant.size2_AR,
        size3: plant.size3_AR,
        size4: plant.size4_AR,
      } : {
        ...commonData,
        plant_name: plant.plant_name_EN,
        description: plant.description_EN,
        pot: plant.pot_EN,
        water: plant.water_EN,
        light: plant.light_EN,
        temperatures: plant.temperatures_EN,
        easy: plant.easy_EN,
        part_sun: plant.part_sun_EN,
        medium: plant.medium_EN,
        size1: plant.size1_EN,
        size2: plant.size2_EN,
        size3: plant.size3_EN,
        size4: plant.size4_EN,
      };
    });
    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plant by name:", error);
    res.status(500).json({ error: "Could not fetch plant" });
  }
}

// Update plant
async function updatePlant(req, res) {
  const plantId = req.params.id;

  const {
    is_active,
    plant_name_EN,
    plant_name_AR,
    description_EN,
    description_AR,
    price1,
    price2,
    price3,
    price4,
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
    size1_EN,
    size1_AR,
    size2_EN,
    size2_AR,
    size3_EN,
    size3_AR,
    size4_EN,
    size4_AR,
    newest,
    recommended,
    subcategory_id,
    category_id,
  } = req.body;

  try {
    if (!plantId || !validator.isNumeric(String(plantId))) {
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

    const sizes = ["size1", "size2", "size3", "size4"];
    const prices = ["price1", "price2", "price3", "price4"];

    for (let i = 0; i < sizes.length; i++) {
      if (req.body[`${sizes[i]}_EN`] || req.body[`${sizes[i]}_AR`]) {
        if (!req.body[`${sizes[i]}_EN`] || !req.body[`${sizes[i]}_AR`]) {
          return res.status(400).json({ error: `Missing size ${i + 1} translation` });
        }
        if (!validator.isNumeric(String(req.body[prices[i]])) || req.body[prices[i]] <= 0) {
          return res.status(400).json({ error: `Invalid ${prices[i]}` });
        }
      }
    }

    const updatedData = {
      id: plantId,
      is_active: is_active || existingPlant.is_active,
      plant_name_EN: plant_name_EN || existingPlant.plant_name_EN,
      plant_name_AR: plant_name_AR || existingPlant.plant_name_AR,
      description_EN: description_EN || existingPlant.description_EN,
      description_AR: description_AR || existingPlant.description_AR,
      price1: price1 || existingPlant.price1,
      price2: price2 || existingPlant.price2,
      price3: price3 || existingPlant.price3,
      price4: price4 || existingPlant.price4,
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
      size1_EN: size1_EN || existingPlant.size1_EN,
      size1_AR: size1_AR || existingPlant.size1_AR,
      size2_EN: size2_EN || existingPlant.size2_EN,
      size2_AR: size2_AR || existingPlant.size2_AR,
      size3_EN: size3_EN || existingPlant.size3_EN,
      size3_AR: size3_AR || existingPlant.size3_AR,
      size4_EN: size4_EN || existingPlant.size4_EN,
      size4_AR: size4_AR || existingPlant.size4_AR,
      newest: newest ?? existingPlant.newest,
      recommended: recommended ?? existingPlant.recommended,
      subcategory_id: subcategory_id || existingPlant.subcategory_id,
      category_id: category_id || existingPlant.category_id,
    };

    const plantUpdateResult = await plantRepository.updatePlant(updatedData);

    res.status(200).json({
      success: true,
      message: "Plant updated successfully.",
      updatedPlant: plantUpdateResult,
    });
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the plant.",
    });
  }
}

// Update plant photo
async function updatePhotoPlant(req, res) {
  const { photoId } = req.params;
  const photoPath = req.file ? `uploads/plants/${req.file.filename}` : null;

  try {
    if (!photoId || !validator.isNumeric(String(photoId))) {
      return res.status(400).json({ error: "Photo ID is required and must be valid." });
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
      message: "Plant photo updated successfully.",
    });
  } catch (error) {
    console.error("Error updating plant photo:", error);
    return res.status(500).json({
      error: "Failed to update plant photo.",
      details: error.message,
    });
  }
}

// Delete plant
async function deletePlant(req, res) {
  const { id } = req.params;
  try {
    if (!id || !validator.isNumeric(String(id))) {
      return res.status(400).json({
        success: false,
        message: "Plant ID is missing or invalid.",
      });
    }

    const plantExists = (await plantRepository.findPlantById(id))[0];
    if (!plantExists) {
      return res.status(404).json({ error: "Plant not found." });
    }

    await plantRepository.deletePlant(id);
    res.status(204).json({
      message: "Plant deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ error: "Could not delete plant." });
  }
}

// Delete plant photo
async function deletePlantPhoto(req, res) {
  const { photoId } = req.params;

  try {
    if (!photoId || !validator.isNumeric(String(photoId))) {
      return res.status(400).json({ error: "Photo ID is required and must be valid." });
    }

    // Fetch photo data by ID
    const photo = await plantPhotoRepository.findPhotoById(photoId);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found!" });
    }

    // Delete the photo record from the database
    await plantPhotoRepository.deletePlantPhoto(photoId);

    return res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting plant photo:", error.message);
    return res.status(500).json({
      error: "Failed to delete plant photo.",
      details: error.message,
    });
  }
}

module.exports = {
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
  deletePlantPhoto,
};
