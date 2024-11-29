const plantPressRepository = require("../repositories/plantPress.repository");
const fs = require("fs");

async function createPlantPress(req, res) {
  try {
    const { description_AR, description_EN } = req.body;

    if (!description_AR || !description_EN) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Arabic and English plant press descriptions are required!",
      });
    }

    const photoPath = req.file
      ? `uploads/plantPress/${req.file.filename}`
      : null;

    const result = await plantPressRepository.savePlantPress({
      description_AR,
      description_EN,
      photoPath,
    });

    return res.status(201).json({
      message: "Plant Press created successfully",
      plantPressId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create plant press",
      details: error.message,
    });
  }
}

async function getAllPlantPresses(req, res) {
  try {
    const plantPresses = await plantPressRepository.findAllPlantPresses();
    const language = req.language;

    const filteredPlantPresses = plantPresses.map((plantPress) => {
      if (language === "ar") {
        return {
          id: plantPress.id,
          description: plantPress.description_AR,
          photo: plantPress.photoPath,
        };
      } else {
        return {
          id: plantPress.id,
          description: plantPress.description_EN,
          photo: plantPress.photoPath,
        };
      }
    });

    return res.status(200).json(filteredPlantPresses);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantPresses",
      details: error.message,
    });
  }
}

async function getPlantPressById(req, res) {
  try {
    const { id } = req.params;
    const plantPress = await plantPressRepository.findPlantPressById(id);

    if (!plantPress) {
      return res.status(404).json({ error: "Plant Press not found" });
    }

    const language = req.language;

    const responsePlantPress = {
      id: plantPress.id,
      photo: plantPress.photoPath,
    };

    if (language === "ar") {
      responsePlantPress.description = plantPress.description_AR;
    } else {
      responsePlantPress.description = plantPress.description_EN;
    }

    return res.status(200).json(responsePlantPress);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantPress",
      details: error.message,
    });
  }
}

async function updatePlantPress(req, res) {
  const { id } = req.params;
  const { description_AR, description_EN } = req.body;
  const photoPath = req.file ? `uploads/plantPress/${req.file.filename}` : null;

  try {
    const existingPlantPress = await plantPressRepository.findPlantPressById(
      id
    );

    if (!existingPlantPress) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(404).json({ error: "Plant Press not found!" });
    }

    if (!description_AR && !description_EN && !photoPath) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingPlantPress.photoPath) {
      try {
        fs.unlinkSync(existingPlantPress.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      description_AR: description_AR || existingPlantPress.description_AR,
      description_EN: description_EN || existingPlantPress.description_EN,
      photoPath: photoPath || existingPlantPress.photoPath,
    };

    await plantPressRepository.updatePlantPress(updatedData);

    return res.status(200).json({
      message: "Plant Press updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);
    return res.status(500).json({
      error: "Failed to update plant Press",
      details: error.message,
    });
  }
}

async function deletePlantPress(req, res) {
  const { id } = req.params;

  try {
    const plantPress = await plantPressRepository.findPlantPressById(id);
    if (!plantPress) {
      return res.status(404).json({ error: "Plant Press not found!" });
    }

    await plantPressRepository.deletePlantPress(id);
    return res
      .status(200)
      .json({ message: "Plant Press deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete plant press",
      details: error.message,
    });
  }
}

module.exports = {
  createPlantPress,
  getAllPlantPresses,
  getPlantPressById,
  updatePlantPress,
  deletePlantPress,
};
