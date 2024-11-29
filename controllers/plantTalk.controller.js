const plantTalkRepository = require("../repositories/plantTalk.repository");
const fs = require("fs");

async function createPlantTalk(req, res) {
  try {
    const { description_AR, description_EN } = req.body;

    if (!description_AR || !description_EN) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Arabic and English plant talk descriptions are required!",
      });
    }

    const photoPath = req.file
      ? `uploads/plantTalk/${req.file.filename}`
      : null;

    const result = await plantTalkRepository.savePlantTalk({
      description_AR,
      description_EN,
      photoPath,
    });

    return res.status(201).json({
      message: "Plant Talk created successfully",
      plantTalkId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create plant talk",
      details: error.message,
    });
  }
}

async function getAllPlantTalks(req, res) {
  try {
    const plantTalks = await plantTalkRepository.findAllPlantTalks();
    const language = req.language;

    const filteredPlantTalks = plantTalks.map((plantTalk) => {
      if (language === "ar") {
        return {
          id: plantTalk.id,
          description: plantTalk.description_AR,
          photo: plantTalk.photoPath,
        };
      } else {
        return {
          id: plantTalk.id,
          description: plantTalk.description_EN,
          photo: plantTalk.photoPath,
        };
      }
    });

    return res.status(200).json(filteredPlantTalks);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantTalks",
      details: error.message,
    });
  }
}

async function getPlantTalkById(req, res) {
  try {
    const { id } = req.params;
    const plantTalk = await plantTalkRepository.findPlantTalkById(id);

    if (!plantTalk) {
      return res.status(404).json({ error: "Plant Talk not found" });
    }

    const language = req.language;

    const responsePlantTalk = {
      id: plantTalk.id,
      photo: plantTalk.photoPath,
    };

    if (language === "ar") {
      responsePlantTalk.description = plantTalk.description_AR;
    } else {
      responsePlantTalk.description = plantTalk.description_EN;
    }

    return res.status(200).json(responsePlantTalk);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve plantTalk",
      details: error.message,
    });
  }
}

async function updatePlantTalk(req, res) {
  const { id } = req.params;
  const { description_AR, description_EN } = req.body;
  const photoPath = req.file ? `uploads/plantTalk/${req.file.filename}` : null;

  try {
    const existingPlantTalk = await plantTalkRepository.findPlantTalkById(id);

    if (!existingPlantTalk) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(404).json({ error: "Plant Talk not found!" });
    }

    if (!description_AR && !description_EN && !photoPath) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingPlantTalk.photoPath) {
      try {
        fs.unlinkSync(existingPlantTalk.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      description_AR: description_AR || existingPlantTalk.description_AR,
      description_EN: description_EN || existingPlantTalk.description_EN,
      photoPath: photoPath || existingPlantTalk.photoPath,
    };

    await plantTalkRepository.updatePlantTalk(updatedData);

    return res.status(200).json({
      message: "Plant Talk updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);
    return res.status(500).json({
      error: "Failed to update plant Talk",
      details: error.message,
    });
  }
}

async function deletePlantTalk(req, res) {
  const { id } = req.params;

  try {
    const plantTalk = await plantTalkRepository.findPlantTalkById(id);
    if (!plantTalk) {
      return res.status(404).json({ error: "Plant Talk not found!" });
    }

    await plantTalkRepository.deletePlantTalk(id);
    return res.status(200).json({ message: "Plant Talk deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete plant talk",
      details: error.message,
    });
  }
}

module.exports = {
  createPlantTalk,
  getAllPlantTalks,
  getPlantTalkById,
  updatePlantTalk,
  deletePlantTalk,
};
