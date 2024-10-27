const pool = require("../config/db");

async function savePlantPhotos(plantId, photos) {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO plant_photo (plant_id, photoPath) VALUES (?, ?)`;
    for (const photo of photos) {
      await connection.execute(query, [plantId, photo.path]);
    }
  } catch (error) {
    console.error("Error saving plant photos:", error);
    throw new Error("Could not save plant photos");
  } finally {
    connection.release();
  }
}

// Update one or multiple plant photos
async function updatePlantPhotos(photoUpdates) {
  const connection = await pool.getConnection();
  try {
    const promises = photoUpdates.map(({ id, path }) => {
      const query = `UPDATE plant_photo SET photoPath = ? WHERE id = ?`;
      return connection.execute(query, [path, id]);
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating plant photos:", error);
    throw new Error("Could not update plant photos");
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
  updatePlantPhotos,
  deletePlantPhoto,
};
