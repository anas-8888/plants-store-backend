const albumRepository = require("../repositories/our.albumPhoto.repository");
const fs = require("fs");

// Create Album
async function createAlbum(req, res) {
  try {
    const photoFiles = (req.files)[0];
    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({ error: "Album file is required." });
    }

    // Use the path of the first file, or loop through if you want to save multiple
    const photoPath = photoFiles
    ? `uploads/ourAlbum/${photoFiles.filename}`
    : null;
    
    const result = await albumRepository.saveAlbum({
      photoPath,
    });

    return res.status(201).json({
      message: "Album created successfully",
      albumId: result.insertId,
    });
  } catch (error) {
    // Cleanup uploaded files if there’s an error
    if (req.files) req.files.forEach((file) => fs.unlinkSync(file.path));
    return res.status(500).json({
      error: "Failed to create Album",
      details: error.message,
    });
  }
}

// Get all album photos
async function findAllAlbumPhotos(req, res) {
  try {
    const albumPhotos = await albumRepository.getAllAlbumPhotos();

    const responsePhotos = albumPhotos.map((photo) => {
      return {
        id: photo.id,
        photo: photo.photoPath,
      };
    });

    return res.status(200).json(responsePhotos);
  } catch (error) {
    console.error("Error retrieving album photos:", error.message);
    return res.status(500).json({
      error: "Failed to retrieve album photos",
      details: error.message,
    });
  }
}

//Find Album By ID
async function findAlbumById(req, res) {
  try {
    const { id } = req.params;
    const album = await albumRepository.findAlbumById(id);

    if (!album) {
      return res.status(404).json({ error: "ID not found" });
    }

    const responseAlbum = {
      id: album.id,
      photo: album.photoPath,
    };

    return res.status(200).json(responseAlbum);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve Album",
      details: error.message,
    });
  }
}

//Delete Home Photo
async function deleteAlbum(req, res) {
  const { id } = req.params;
  try {
    const album = await albumRepository.findAlbumById(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found!" });
    }

    await albumRepository.deleteAlbum(id);
    return res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete Album",
      details: error.message,
    });
  }
}

module.exports = {
  createAlbum,
  findAllAlbumPhotos,
  findAlbumById,
  deleteAlbum,
};
