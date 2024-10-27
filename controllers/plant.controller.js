const plantRepository = require("../repositories/plant.repository");
const plantPhotoRepository = require("../repositories/plant_photo.repository");
const validator = require("validator");
const fs = require("fs");

//Create plant with photos
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

//Find All Plants With Photos
async function findAllPlantsWithPhotos(req, res) {
  try {
    const plants = await plantRepository.findAllPlantsWithPhotos();
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      let photoBase64 = null;

      // Only read the first photo in the array
      if (plant.photos && plant.photos.length > 0) {
        try {
          photoBase64 = fs.readFileSync(plant.photos[0], {
            encoding: "base64",
          });
        } catch (err) {
          console.error(`Error reading photo at path: ${plant.photos[0]}`, err);
        }
      }

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
          photos: photoBase64,
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
          photos: photoBase64,
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants with photos:", error);
    res.status(500).json({ error: "Could not fetch plants with photos" });
  }
}

// Find Plant By ID with Language Filtering
async function findPlantById(req, res) {
  const { id } = req.params;
  try {
    const plants = await plantRepository.findPlantById(id);
    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }

    const language = req.language;
    const filteredPlants = plants.map((plant) => {
      const photosBase64 = plant.photos
        .map((photoPath) => {
          try {
            return fs.readFileSync(photoPath, { encoding: "base64" });
          } catch (err) {
            console.error(`Error reading photo at path: ${photoPath}`, err);
            return null;
          }
        })
        .filter((photo) => photo !== null); // Filter out any null values

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
          photos: photosBase64,
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
          photos: photosBase64,
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ error: "Could not fetch plant" });
  }
}

async function findPlantsBySubcategory(req, res) {
  try {
    const { subcategoryId } = req.params;
    const plants = await plantRepository.findPlantsBySubcategory(subcategoryId);
    const language = req.language;

    const filteredPlants = plants.map((plant) => {
      let photoBase64 = null;

      // Only read the first photo in the array
      if (plant.photos && plant.photos.length > 0) {
        try {
          photoBase64 = fs.readFileSync(plant.photos[0], {
            encoding: "base64",
          });
        } catch (err) {
          console.error(`Error reading photo at path: ${plant.photos[0]}`, err);
        }
      }

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
          photos: photoBase64,
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
          photos: photoBase64,
        };
      }
    });

    res.status(200).json(filteredPlants);
  } catch (error) {
    console.error("Error fetching plants by subcategory:", error);
    res.status(500).json({ error: "Could not fetch plants by subcategory" });
  }
}

//Update Plant
async function updatePlantAndPhotos(req, res) {
  const plantId = req.params.id;
  console.log("plantID:", plantId);
  console.log("Request body:", req.body);

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
    photoUpdates,
  } = req.body;

  try {
    // Find the plant by ID to check if it exists
    const existingPlant = await plantRepository.findPlantById(plantId);

    if (!existingPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found.",
      });
    }

    // Check if plantId exists
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: "Plant ID is missing or invalid.",
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
    };
    console.log("updatedData:", updatedData);

    // Update plant details, passing validated parameters
    const plantUpdateResult = await plantRepository.updatePlant(updatedData);

    // Update photos if any
    if (photoUpdates && photoUpdates.length > 0) {
      await plantPhotoRepository.updatePlantPhotos(plantId, photoUpdates);
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: plantUpdateResult.message,
      updatedPlant: plantUpdateResult,
    });
  } catch (error) {
    console.error("Error updating plant and photos:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating plant and photos",
    });
  }
}

//Delete Plant
async function deletePlant(req, res) {
  const { id } = req.params;
  try {
    await plantPhotoRepository.deletePlantPhoto(id);
    await plantRepository.deletePlant(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ error: "Could not delete plant" });
  }
}

module.exports = {
  savePlant,
  findAllPlantsWithPhotos,
  findPlantById,
  findPlantsBySubcategory,
  updatePlantAndPhotos,
  deletePlant,
};
