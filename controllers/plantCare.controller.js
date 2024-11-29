const plantCareRepository = require("../repositories/plantCare.repository");
const fs = require("fs");

async function createPlantCare(req, res) {
  try {
    const { description_AR, description_EN } = req.body;

    if (!description_AR || !description_EN) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Arabic and English plant care descriptions are required!",
      });
    }

    const photoPath = req.file
      ? `uploads/plantCare/${req.file.filename}`
      : null;

    const result = await plantCareRepository.savePlantCare({
      description_AR,
      description_EN,
      photoPath,
    });

    return res.status(201).json({
      message: "Plant Care created successfully",
      plantCareId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create plant care",
      details: error.message,
    });
  }
}

async function getAllPlantCares(req, res) {
  try {
    const plantCares = await plantCareRepository.findAllPlantCares();
    const language = req.language;

    const filteredPlantCares = plantCares.map((plantCare) => {
      if (language === "ar") {
        return {
          id: plantCare.id,
          description: plantCare.description_AR,
          photo: plantCare.photoPath,
        };
      } else {
        return {
          id: plantCare.id,
          description: plantCare.description_EN,
          photo: plantCare.photoPath,
        };
      }
    });

    return res.status(200).json(filteredPlantCares);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantCares",
      details: error.message,
    });
  }
}

async function getPlantCareById(req, res) {
  try {
    const { id } = req.params;
    const plantCare = await plantCareRepository.findPlantCareById(id);

    if (!plantCare) {
      return res.status(404).json({ error: "Plant Care not found" });
    }

    const language = req.language;

    const responsePlantCare = {
      id: plantCare.id,
      photo: plantCare.photoPath,
    };

    if (language === "ar") {
      responsePlantCare.description = plantCare.description_AR;
    } else {
      responsePlantCare.description = plantCare.description_EN;
    }

    return res.status(200).json(responsePlantCare);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantCare",
      details: error.message,
    });
  }
}

async function updatePlantCare(req, res) {
  const { id } = req.params;
  const { description_AR, description_EN } = req.body;
  const photoPath = req.file ? `uploads/plantCare/${req.file.filename}` : null;

  try {
    const existingPlantCare = await plantCareRepository.findPlantCareById(id);

    if (!existingPlantCare) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(404).json({ error: "Plant Care not found!" });
    }

    if (!description_AR && !description_EN && !photoPath) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingPlantCare.photoPath) {
      try {
        fs.unlinkSync(existingPlantCare.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      description_AR: description_AR || existingPlantCare.description_AR,
      description_EN: description_EN || existingPlantCare.description_EN,
      photoPath: photoPath || existingPlantCare.photoPath,
    };

    await plantCareRepository.updatePlantCare(updatedData);

    return res.status(200).json({
      message: "Plant Care updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);
    return res.status(500).json({
      error: "Failed to update plant Care",
      details: error.message,
    });
  }
}

async function deletePlantCare(req, res) {
  const { id } = req.params;

  try {
    const plantCare = await plantCareRepository.findPlantCareById(id);
    if (!plantCare) {
      return res.status(404).json({ error: "Plant Care not found!" });
    }

    await plantCareRepository.deletePlantCare(id);
    return res.status(200).json({ message: "Plant Care deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete plant care",
      details: error.message,
    });
  }
}

module.exports = {
  createPlantCare,
  getAllPlantCares,
  getPlantCareById,
  updatePlantCare,
  deletePlantCare,
};
