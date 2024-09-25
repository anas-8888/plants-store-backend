const plantRepository = require("../repositories/plant.repository");
const upload = require("../middleware/uploadPlants");
const validator = require("validator");
const fs = require("fs");
const path = require("path");

async function createPlant(req, res) {
  const {
    plant_name,
    description,
    price,
    pot,
    quantity,
    subcategory_id,
    water = 'no info',
    light = 'no info',
    toxicity = 'no info',
    humidity = 'no info',
    problems_pests = 'no info',
    fertilizing = 'no info',
    temperatures = 'no info',
    soil_repotting = 'no info',
    learn_more = 'no info',
    characteristics = 'no info',
  } = req.body;

  if (!plant_name || !description || !price || !pot || !quantity || !subcategory_id) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (!validator.isDecimal(String(price))) {
    return res.status(400).json({ error: "Invalid price format!" });
  }

  if (!validator.isInt(String(quantity))) {
    return res.status(400).json({ error: "Invalid quantity!" });
  }

  if (!validator.isInt(String(subcategory_id))) {
    return res.status(400).json({ error: "Invalid subcategory ID!" });
  }

  if (req.files && req.files.length > 5) {
    return res.status(400).json({ error: "Maximum 5 photos allowed!" });
  }

  try {
    const result = await plantRepository.savePlant({
      plant_name,
      description,
      price,
      pot,
      quantity,
      subcategory_id,
      water,
      light,
      toxicity,
      humidity,
      problems_pests,
      fertilizing,
      temperatures,
      soil_repotting,
      learn_more,
      characteristics,
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
    const plants = await plantRepository.findAllPlants();

    const plantsWithPhotos = await Promise.all(plants.map(async (plant) => {
      const photos = await plantRepository.findPlantPhotosById(plant.id);
      const base64Photos = photos.map(photo => ({
        id: photo.id,
        base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
      }));

      return { ...plant, photos: base64Photos };
    }));

    return res.status(200).json(plantsWithPhotos);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve plants", details: error.message });
  }
}

// Get Plant By ID
async function getPlantById(req, res) {
  const { id } = req.params;
  try {
    const plant = await plantRepository.findPlantById(id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    const photos = await plantRepository.findPlantPhotosById(id);
    const base64Photos = photos.map(photo => ({
      id: photo.id,
      base64: fs.existsSync(photo.photo) ? fs.readFileSync(photo.photo, { encoding: 'base64' }) : null,
    }));

    return res.status(200).json({ ...plant, photos: base64Photos });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve plant", details: error.message });
  }
}

async function findPlantsBySubcategory(req, res) {
  const { subcategory_id } = req.params;

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

      return { ...plant, photos: base64Photos };
    }));

    return res.status(200).json(plantData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching plants", error: error.message });
  }
};


// Update Plant
async function updatePlant(req, res) {
  const { id } = req.params;

  try {
    const existingPlant = await plantRepository.findPlantById(id);
    if (!existingPlant) {
      return res.status(404).json({ error: "Plant not found!" });
    }

    const {
      plant_name,
      description,
      price,
      pot,
      quantity,
      subcategory_id,
      water,
      light,
      toxicity,
      humidity,
      problems_pests,
      fertilizing,
      temperatures,
      soil_repotting,
      learn_more,
      characteristics,
    } = req.body;

    const plantData = {
      plant_name: plant_name || existingPlant.plant_name,
      description: description || existingPlant.description,
      price: price || existingPlant.price,
      pot: pot || existingPlant.pot,
      quantity: quantity || existingPlant.quantity,
      subcategory_id: subcategory_id || existingPlant.subcategory_id,
      water: water || existingPlant.water,
      light: light || existingPlant.light,
      toxicity: toxicity || existingPlant.toxicity,
      humidity: humidity || existingPlant.humidity,
      problems_pests: problems_pests || existingPlant.problems_pests,
      fertilizing: fertilizing || existingPlant.fertilizing,
      temperatures: temperatures || existingPlant.temperatures,
      soil_repotting: soil_repotting || existingPlant.soil_repotting,
      learn_more: learn_more || existingPlant.learn_more,
      characteristics: characteristics || existingPlant.characteristics,
    };

    if (req.files && req.files.length > 0) {
      try {
        await plantRepository.savePlantPhotos(id, req.files);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update photos", details: error.message });
      }
    }

    const result = await plantRepository.updatePlant(id, plantData);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json({ message: "Plant updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update plant", details: error.message });
  }
}

// Delete Plant
async function deletePlant(req, res) {
  const { id } = req.params;

  try {
    const plant = await plantRepository.findPlantById(id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found!" });
    }

    const photos = await plantRepository.findPlantPhotosById(id);
    photos.forEach(photo => {
      fs.unlink(path.join(__dirname, "..", photo.photo), (err) => {
        if (err) console.error("Error deleting photo:", err);
      });
    });

    await plantRepository.deletePlant(id);

    return res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete plant", details: error.message });
  }
}

// Delete Specific Plant Photo
async function deletePlantPhoto(req, res) {
  const { photo_id } = req.params;

  try {
    const photo = await plantRepository.findPlantPhotoById(photo_id);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found!" });
    }

    fs.unlink(path.join(__dirname, "..", photo.photo), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete photo from filesystem." });
      }
    });

    await plantRepository.deletePlantPhoto(photo_id);

    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete photo", details: error.message });
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
