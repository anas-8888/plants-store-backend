const homeRepository = require("../repositories/home.photo.repository");
const fs = require("fs");
const path = require('path');

//Create Home Photo
async function createHomePhoto(req, res) {
  try {
    const photoPath = req.file?.path || null;

    if (!photoPath) {
      return res.status(400).json({ error: "Photo file is required." });
    }

    const result = await homeRepository.saveHomePhoto({
      photoPath,
    });

    return res.status(201).json({
      message: "Home Photo created successfully",
      homeId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create Home Photo",
      details: error.message,
    });
  }
}

//Find Home Photo By ID
async function findHomePhotoById(req, res) {
  try {
    const { id } = req.params;
    const homePhoto = await homeRepository.findHomeById(id);

    if (!homePhoto) {
      return res.status(404).json({ error: "ID not found" });
    }
    const base64Photo = homePhoto.photoPath
      ? fs.readFileSync(homePhoto.photoPath, { encoding: "base64" })
      : null;

    const responseHomePhoto = {
      id: homePhoto.id,
      photo: base64Photo,
    };

    return res.status(200).json(responseHomePhoto);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve Home Photo",
      details: error.message,
    });
  }
}

//Delete Home Photo
async function deleteHomePhoto(req, res) {
  const { id } = req.params;
  try {
    const homePhoto = await homeRepository.findHomeById(id);
    if (!homePhoto) {
      return res.status(404).json({ error: "Home Photo not found!" });
    }

    if (homePhoto.photoPath) {
      try {
        fs.unlinkSync(homePhoto.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    await homeRepository.deleteHomePhoto(id);
    return res.status(200).json({ message: "Home Photo deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Home Photo",
      details: error.message,
    });
  }
}

// Get all home photos with base64 encoding
async function findAllHomePhotos(req, res) {
  try {
    const homePhotos = await homeRepository.getAllHomePhotos();

    const responsePhotos = homePhotos.map((photo) => {
      const base64Photo = photo.photoPath
        ? fs.readFileSync(path.join(__dirname, "..", photo.photoPath), { encoding: "base64" })
        : null;

      return {
        id: photo.id,
        photo: base64Photo,
      };
    });

    return res.status(200).json(responsePhotos);
  } catch (error) {
    console.error("Error retrieving home photos:", error.message);
    return res.status(500).json({
      error: "Failed to retrieve home photos",
      details: error.message,
    });
  }
}

module.exports = {
  createHomePhoto,
  findHomePhotoById,
  deleteHomePhoto,
  findAllHomePhotos
};
