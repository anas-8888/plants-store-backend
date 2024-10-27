const pool = require("../config/db");

//Save Album
async function saveAlbum(albumData) {
  try {
    const { photoPath } = albumData;
    const connection = await pool.getConnection();

    const query = ` INSERT INTO our_album_photo(photoPath)
    VALUES(?)`;
    const [result] = await connection.execute(query, [photoPath]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating Album:", error);
    throw error;
  }
}

//Find Album By ID
async function findAlbumById(albumId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM our_album_photo WHERE id = ?`;
    const [rows] = await connection.execute(query, [albumId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Album Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding Album by ID:", error);
    throw error;
  }
}

//Update Album
async function updateAlbum(albumData) {
  const { id, photoPath } = albumData;

  try {
    const connection = await pool.getConnection();
    const query = `
      UPDATE our_album_photo
      SET photoPath = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [photoPath, id]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Album Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Home Photo:", error);
    throw error;
  }
}

//Delete Album
async function deleteAlbum(albumId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM our_album_photo WHERE id = ?`;

    const [result] = await connection.execute(query, [albumId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Album Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting Album:", error);
    throw error;
  }
}

module.exports = {
  saveAlbum,
  findAlbumById,
  updateAlbum,
  deleteAlbum,
};
