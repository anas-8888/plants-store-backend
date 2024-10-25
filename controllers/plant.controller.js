const plantRepository = require("../repositories/plant.repository");
const upload = require("../middleware/uploadPlants");
const validator = require("validator");
const fs = require("fs");
const path = require("path");

function selectPlantFields(plant, language) {
  return language === 'en' ? {
    plant_name: plant.plant_name_EN,
    description: plant.description_EN,
    price: plant.price,
    pot: plant.pot_EN,
    quantity: plant.quantity,
    subcategory_id: plant.subcategory_id,
    water: plant.water_EN,
    light: plant.light_EN,
    toxicity: plant.toxicity_EN,
    humidity: plant.humidity_EN,
    problems_pests: plant.problems_pests_EN,
    fertilizing: plant.fertilizing_EN,
    temperatures: plant.temperatures_EN,
    soil_repotting: plant.soil_repotting_EN,
    learn_more: plant.learn_more_EN,
    characteristics: plant.characteristics_EN,
  } : {
    plant_name: plant.plant_name_AR,
    description: plant.description_AR,
    price: plant.price,
    pot: plant.pot_AR,
    quantity: plant.quantity,
    subcategory_id: plant.subcategory_id,
    water: plant.water_AR,
    light: plant.light_AR,
    toxicity: plant.toxicity_AR,
    humidity: plant.humidity_AR,
    problems_pests: plant.problems_pests_AR,
    fertilizing: plant.fertilizing_AR,
    temperatures: plant.temperatures_AR,
    soil_repotting: plant.soil_repotting_AR,
    learn_more: plant.learn_more_AR,
    characteristics: plant.characteristics_AR,
  };
}

// Create a new plant
async function createPlant(req, res) {
  const {
    plant_name_EN, plant_name_AR, description_EN = 'no info', description_AR = 'لا يوجد معلومات',
    price, pot_EN, pot_AR, quantity, subcategory_id,
    water_EN = 'no info', water_AR = 'لا يوجد معلومات',
    light_EN = 'no info', light_AR = 'لا يوجد معلومات',
    toxicity_EN = 'no info', toxicity_AR = 'لا يوجد معلومات',
    humidity_EN = 'no info', humidity_AR = 'لا يوجد معلومات',
    problems_pests_EN = 'no info', problems_pests_AR = 'لا يوجد معلومات',
    fertilizing_EN = 'no info', fertilizing_AR = 'لا يوجد معلومات',
    temperatures_EN = 'no info', temperatures_AR = 'لا يوجد معلومات',
    soil_repotting_EN = 'no info', soil_repotting_AR = 'لا يوجد معلومات',
    learn_more_EN = 'no info', learn_more_AR = 'لا يوجد معلومات',
    characteristics_EN = 'no info', characteristics_AR = 'لا يوجد معلومات',
  } = req.body;

  if (!plant_name_EN || !plant_name_AR || !price || !pot_EN || !pot_AR || !quantity || !subcategory_id) {
    return res.status(400).json({ error: "Missing required fields!" });
  }

  if (!validator.isDecimal(String(price)) || !validator.isInt(String(quantity)) || !validator.isInt(String(subcategory_id))) {
    return res.status(400).json({ error: "Invalid format for price, quantity, or subcategory ID!" });
  }

  if (req.files && req.files.length > 5) {
    return res.status(400).json({ error: "Maximum 5 photos allowed!" });
  }

  try {
    const result = await plantRepository.savePlant({
      plant_name_EN, plant_name_AR, description_EN, description_AR, price, pot_EN, pot_AR, quantity, subcategory_id,
      water_EN, water_AR, light_EN, light_AR, toxicity_EN, toxicity_AR, humidity_EN, humidity_AR,
      problems_pests_EN, problems_pests_AR, fertilizing_EN, fertilizing_AR, temperatures_EN, temperatures_AR,
      soil_repotting_EN, soil_repotting_AR, learn_more_EN, learn_more_AR, characteristics_EN, characteristics_AR,
    });

    const plantId = result[0].insertId;

    if (req.files && req.files.length > 0) {
      await plantRepository.savePlantPhotos(plantId, req.files);
    }

    return res.status(201).json({ message: "Plant created successfully", plantId });
  } catch (error) {
    console.error("Error creating plant:", error);
    return res.status(500).json({ error: "Failed to create plant", details: error.message });
  }
}

// Get All Plants
async function getAllPlants(req, res) {
  try {
    const language = req.language;
    const plants = await plantRepository.findAllPlants();
    const plantsWithPhotos = await Promise.all(plants.map(async (plant) => {
      const photos = await plantRepository.findPlantPhotosById(plant.id);
      const base64Photos = photos.map(photo => ({
        id: photo.id,
        base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
      }));
      return { ...selectPlantFields(plant, language), photos: base64Photos };
    }));
    return res.status(200).json(plantsWithPhotos);
  } catch (error) {
    console.error("Error retrieving plants:", error);
    return res.status(500).json({ error: "Failed to retrieve plants", details: error.message });
  }
}

// Get Plant By ID
async function getPlantById(req, res) {
  try {
    const { id } = req.params;
    const language = req.language;

    const plant = await plantRepository.findPlantById(id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    const photos = await plantRepository.findPlantPhotosById(id);
    const base64Photos = photos.map(photo => ({
      id: photo.id,
      base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
    }));

    return res.status(200).json({ ...selectPlantFields(plant, language), photos: base64Photos });
  } catch (error) {
    console.error("Error retrieving plant by ID:", error);
    return res.status(500).json({ error: "Failed to retrieve plant by ID" });
  }
}

async function findPlantsBySubcategory(req, res) {
  const { subcategory_id } = req.params;
  const language = req.language;

  try {
    const plants = await plantRepository.findPlantsBySubcategory(subcategory_id);

    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "No plants in this category" });
    }

    const plantData = await Promise.all(plants.map(async (plant) => {
      const photos = await plantRepository.findPlantPhotosById(plant.id);
      const base64Photos = photos.map(photo => ({
        id: photo.id,
        base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
      }));

      return { ...selectPlantFields(plant, language), photos: base64Photos };
    }));

    return res.status(200).json(plantData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching plants", error: error.message });
  }
};


// Update Plant
async function updatePlant(req, res) {
  try {
    const { id } = req.params;
    const language = req.language;

    const plant = await plantRepository.findPlantById(id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    await plantRepository.updatePlant(id, req.body);

    if (req.files && req.files.length > 0) {
      await plantRepository.savePlantPhotos(id, req.files);
    }

    const updatedPlant = await plantRepository.findPlantById(id);
    const photos = await plantRepository.findPlantPhotosById(id);
    const base64Photos = photos.map(photo => ({
      id: photo.id,
      base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
    }));

    return res.status(200).json({ ...selectPlantFields(updatedPlant, language), photos: base64Photos });
  } catch (error) {
    console.error("Error updating plant:", error);
    return res.status(500).json({ error: "Failed to update plant" });
  }
}

// Delete Plant
async function deletePlant(req, res) {
  try {
    const { id } = req.params;
    const plant = await plantRepository.findPlantById(id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    const photos = await plantRepository.findPlantPhotosById(id);
    photos.forEach(photo => {
      if (fs.existsSync(photo.photo)) {
        fs.unlinkSync(photo.photo);
      }
    });

    await plantRepository.deletePlant(id);
    return res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    return res.status(500).json({ error: "Failed to delete plant" });
  }
}

// Delete Specific Plant Photo
async function deletePlantPhoto(req, res) {
  try {
    const { photo_id } = req.params;
    const photo = await plantRepository.findPlantPhotoById(photo_id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (fs.existsSync(photo.photo)) {
      fs.unlinkSync(photo.photo);
    }

    await plantRepository.deletePlantPhoto(photo_id);
    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return res.status(500).json({ error: "Failed to delete photo" });
  }
}

module.exports = {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  deletePlantPhoto,
  findPlantsBySubcategory,
};
