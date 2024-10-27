const albumRepository = require("../repositories/our.albumPhoto.repository");
const fs = require("fs");

/// Create Album
async function createAlbum(req, res) {
  try {
    const photoFiles = req.files;

    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({ error: "Album file is required." });
    }

    // Use the path of the first file, or loop through if you want to save multiple
    const photoPath = photoFiles[0].path;

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

//Find Album By ID
async function findAlbumById(req, res) {
  try {
    const { id } = req.params;
    const album = await albumRepository.findAlbumById(id);

    if (!album) {
      return res.status(404).json({ error: "ID not found" });
    }
    const base64Photo = album.photoPath
      ? fs.readFileSync(album.photoPath, { encoding: "base64" })
      : null;

    const responseAlbum = {
      id: album.id,
      photo: base64Photo,
    };

    return res.status(200).json(responseAlbum);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve Album",
      details: error.message,
    });
  }
}

//Update Album
async function updateAlbum(req, res) {
  const { id } = req.params;
  const photoPath = req.file?.path || null;

  try {
    const existingAlbum = await albumRepository.findAlbumById(id);

    if (photoPath && existingAlbum.photoPath) {
      try {
        fs.unlinkSync(existingAlbum.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      photoPath: photoPath || existingAlbum.photoPath,
    };

    await albumRepository.updateAlbum(updatedData);

    return res.status(200).json({
      message: "Album updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);

    return res.status(500).json({
      error: "Failed to update Album",
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

    if (album.photoPath) {
      try {
        fs.unlinkSync(album.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
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
  findAlbumById,
  updateAlbum,
  deleteAlbum,
};
