const plantRepository = require("../repositories/plant.repository");
const upload = require("../middleware/uploadPlants");
const validator = require("validator");

async function createPlant(req, res) {
  // Check for file upload errors
  if (!req.file) {
    return res.status(400).json({ error: "Photo is required!" });
  }

  // Extracting data from request body
  const { plant_name, description, price, pot, quantity, subcategory_id } =
    req.body;

  // Photo comes from the file upload
  const photo = req.file.path;

  // Validate required fields
  if (
    !plant_name ||
    !description ||
    !price ||
    !pot ||
    !quantity ||
    !subcategory_id
  ) {
    return res.status(400).json({ error: "All Fields are Required!" });
  }

  // Validate the price
  if (!validator.isDecimal(String(price))) {
    return res.status(400).json({ error: "Invalid Price Format!" });
  }

  // Validate quantity
  if (!validator.isInt(String(quantity))) {
    return res.status(400).json({ error: "Invalid Quantity!" });
  }

  // Validate subcategory ID
  if (!validator.isInt(String(subcategory_id))) {
    return res.status(400).json({ error: "Invalid Subcategory ID!" });
  }

  try {
    const result = await plantRepository.savePlant({
      plant_name,
      description,
      photo,
      price,
      pot,
      quantity,
      subcategory_id,
    });

    return res.status(201).json({
      message: "Plant created successfully",
      plantId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create plant",
      details: error.message,
    });
  }
}
/*Create Plant
async function createPlant(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    // Extracting data from request body
    const { plant_name, description, price, pot, quantity, subcategory_id } =
      req.body;

    // Photo comes from the file upload
    const photo = req.file ? req.file.path : null;

    // Validate required fields
    if (
      !plant_name ||
      !description ||
      !photo ||
      !price ||
      !pot ||
      !quantity ||
      !subcategory_id
    ) {
      return res.status(400).json({ error: "All Fields are Required!" });
    }

    // Validate the price
    if (!validator.isDecimal(String(price))) {
      return res.status(400).json({ error: "Invalid Price Format!" });
    }

    // Validate quantity
    if (!validator.isInt(String(quantity))) {
      return res.status(400).json({ error: "Invalid Quantity!" });
    }

    // Validate subcategory ID
    if (!validator.isInt(String(subcategory_id))) {
      return res.status(400).json({ error: "Invalid Subcategory ID!" });
    }

    try {
      const result = await plantRepository.savePlant({
        plant_name,
        description,
        photo,
        price,
        pot,
        quantity,
        subcategory_id,
      });

      return res.status(201).json({
        message: "Plant created successfully",
        plantId: result.insertId,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to create plant",
        details: error.message,
      });
    }
  });
}
*/
// Get All Plants
async function getAllPlants(req, res) {
  try {
    const plants = await plantRepository.findAllPlants();
    return res.status(200).json(plants);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plants",
      details: error.message,
    });
  }
}

// Get Plant By ID
async function getPlantById(req, res) {
  const { id } = req.params;
  try {
    const plant = await plantRepository.findPlantById(id);
    return res.status(200).json(plant);
  } catch (error) {
    return res.status(404).json({
      error: "Plant not found",
      details: error.message,
    });
  }
}

// Find Plants By Subcategory
async function findPlantsBySubcategory(req, res) {
  const { subcategory_id } = req.params;

  if (!subcategory_id || isNaN(subcategory_id)) {
    return res.status(400).json({ error: "Invalid subcategory ID" });
  }

  try {
    const plants = await plantRepository.findPlantsBySubcategory(
      subcategory_id
    );
    return res.status(200).json(plants);
  } catch (error) {
    return res.status(404).json({
      error: "Plants not found for the specified subcategory",
      details: error.message,
    });
  }
}

// Update Plant
async function updatePlant(req, res) {
  const { id } = req.params;

  // Check for file upload errors
  const photo = req.file ? req.file.path : null;

  const { plant_name, description, price, pot, quantity, subcategory_id } =
    req.body;

  const plantData = {
    plant_name,
    description,
    price,
    pot,
    quantity,
    subcategory_id,
  };

  if (photo) {
    plantData.photo = photo; // Add photo to plantData if a new one was uploaded
  }

  try {
    const result = await plantRepository.updatePlant(id, plantData);

    if (result.success) {
      return res.status(200).json({
        message: "Plant updated successfully",
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update plant",
      details: error.message,
    });
  }
}

/*
//Update Plant
async function updatePlant(req, res) {
  const { id } = req.params;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    const { plant_name, description, price, pot, quantity, subcategory_id } =
      req.body;
    const photo = req.file ? req.file.path : null; // Handle new photo upload

    const plantData = {
      plant_name,
      description,
      price,
      pot,
      quantity,
      subcategory_id,
    };

    if (photo) {
      plantData.photo = photo; // Add photo to plantData if a new one was uploaded
    }
    try {
      const result = await plantRepository.updatePlant(id, plantData);

      if (result.success) {
        return res.status(200).json({
          message: "Plant updated successfully",
        });
      } else {
        return res.status(400).json({
          error: result.message,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update plant",
        details: error.message,
      });
    }
  });
}
*/
// Delete Plant
async function deletePlant(req, res) {
  const { id } = req.params;
  try {
    await plantRepository.deletePlant(id);
    return res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete plant",
      details: error.message,
    });
  }
}

module.exports = {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  findPlantsBySubcategory,
};
