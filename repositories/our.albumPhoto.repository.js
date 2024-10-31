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


async function getAllAlbumPhotos() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT id, photoPath FROM our_album_photo`;
    const [rows] = await connection.execute(query);
    connection.release();

    return rows;
  } catch (error) {
    console.error("Error retrieving all album photos:", error.message);
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
  getAllAlbumPhotos,
  findAlbumById,
  deleteAlbum,
};
