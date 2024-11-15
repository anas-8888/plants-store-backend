const homeRepository = require("../repositories/home.photo.repository");
const fs = require("fs");
const path = require('path');

//Create Home Photo
async function createHomePhoto(req, res) {
  try {
    const photoPath = req.file
    ? `uploads/home_photo/${req.file.filename}`
    : null;

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

    const responseHomePhoto = {
      id: homePhoto.id,
      photo: homePhoto.photoPath,
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

    await homeRepository.deleteHomePhoto(id);
    return res.status(200).json({ message: "Home Photo deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Home Photo",
      details: error.message,
    });
  }
}

// Get all home photos
async function findAllHomePhotos(req, res) {
  try {
    const homePhotos = await homeRepository.getAllHomePhotos();

    const responsePhotos = homePhotos.map((photo) => {
      return {
        id: photo.id,
        photo: photo.photoPath,
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
