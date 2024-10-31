const pool = require("../config/db");

async function findPhotoById(photoId) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM plant_photo WHERE id = ?`;
    const [rows] = await connection.execute(query, [photoId]);
    return rows[0];
  } finally {
    connection.release();
  }
}

async function updatePlantPhoto({ photoId, plant_id, photoPath }) {
  const connection = await pool.getConnection();
  try {
    // Update the existing record with the new photo path
    const updateQuery = `UPDATE plant_photo SET photoPath = ?, plant_id = ? WHERE id = ?`;
    const [result] = await connection.execute(updateQuery, [photoPath, plant_id, photoId]);

    if (result.affectedRows === 0) {
      throw new Error("No photo found with the given id.");
    }
  } catch (error) {
    console.error("Error updating plant photo:", error.message);
    throw new Error("Could not update plant photo");
  } finally {
    connection.release();
  }
}


async function savePlantPhotos(plantId, photos) {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO plant_photo (plant_id, photoPath) VALUES (?, ?)`;
    for (const photo of photos) {
      const photoPath = photo
        ? `uploads/plants/${photo.filename}`
        : null;
      await connection.execute(query, [plantId, photoPath]);
    }
  } catch (error) {
    console.error("Error saving plant photos:", error);
    throw new Error("Could not save plant photos");
  } finally {
    connection.release();
  }
}

// Delete a single photo by photo ID
async function deletePlantPhoto(photoId) {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM plant_photo WHERE id = ?`;
    await connection.execute(query, [photoId]);
  } catch (error) {
    console.error("Error deleting single plant photo:", error);
    throw new Error("Could not delete the specified photo");
  } finally {
    connection.release();
  }
}

module.exports = {
  savePlantPhotos,
  deletePlantPhoto,
  findPhotoById,
  updatePlantPhoto
};
