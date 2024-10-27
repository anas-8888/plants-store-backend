const pool = require("../config/db");

//Save Home Photo
async function saveHomePhoto(homeData) {
  try {
    const { photoPath } = homeData;
    const connection = await pool.getConnection();

    const query = ` INSERT INTO home_photo(photoPath)
    VALUES(?)`;
    const [result] = await connection.execute(query, [photoPath]);

    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating HomePhoto:", error);
    throw error;
  }
}

//Find Home Photo By ID
async function findHomeById(homeId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM home_photo WHERE id = ?`;
    const [rows] = await connection.execute(query, [homeId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Home Photo Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding Home Photo by ID:", error);
    throw error;
  }
}

//Update Home Photo
async function updateHomePhoto(homeData) {
  const { id, photoPath } = homeData;

  try {
    const connection = await pool.getConnection();
    const query = `
      UPDATE home_photo
      SET photoPath = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [photoPath, id]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Home Photo Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Home Photo:", error);
    throw error;
  }
}

//Delete Home Photo
async function deleteHomePhoto(homeId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM home_photo WHERE id = ?`;

    const [result] = await connection.execute(query, [homeId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Home Photo Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting Home Photo:", error);
    throw error;
  }
}

module.exports = {
  saveHomePhoto,
  findHomeById,
  updateHomePhoto,
  deleteHomePhoto,
};
