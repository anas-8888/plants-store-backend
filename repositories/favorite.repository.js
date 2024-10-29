const pool = require("../config/db");

//Save Favorite
async function saveFavorite(dataFavorite) {
  try {
    const { customerId, plantId } = dataFavorite;

    const connection = await pool.getConnection();

    const query = `
    INSERT INTO favorite (customerId, plantId)
    VALUES (?, ?)`;

    const [result] = await connection.execute(query, [customerId, plantId]);

    connection.release();

    return result;
  } catch (error) {
    console.error("Error creating favorite:", error);
    throw error;
  }
}

//Find All Favorite
async function findAllFavorite() {
  try {
    const connection = await pool.getConnection();

    const query = ` SELECT * FROM favorite`;

    const [rows] = await connection.execute(query);

    connection.release();

    return rows;
  } catch (error) {
    console.error("Error finding favorite:", error);
    throw error;
  }
}

// Find Favorite by ID
async function findFavoriteById(favoriteId) {
  try {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM favorite WHERE id = ?`;

    const [rows] = await connection.execute(query, [favoriteId]);

    connection.release();

    if (rows.length === 0) {
      throw new Error("Favorite Not Found");
    }

    return rows[0]; // Return the found favorite record
  } catch (error) {
    console.error("Error finding favorite by ID:", error);
    throw error;
  }
}

//Delete Favorite
async function deleteFavorite(favoriteId) {
  try {
    const connection = await pool.getConnection();

    const query = `DELETE FROM favorite WHERE id = ?`;

    const [result] = await connection.execute(query, [favoriteId]);

    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Favorite Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting favorite:", error);
    throw error;
  }
}

// Retrieve all favorite plants by customer ID
async function findFavoritesByCustomerId(customerId) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM favorite WHERE customerId = ?`;
    const [rows] = await connection.execute(query, [customerId]);
    return rows;
  } finally {
    connection.release();
  }
}

// Check if a specific plant is a favorite for a customer
async function isFavorite(customerId, plantId) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM favorite WHERE customerId = ? AND plantId = ?`;
    const [rows] = await connection.execute(query, [customerId, plantId]);
    return rows[0] || null; // Return the first row or null if not found
  } finally {
    connection.release();
  }
}

module.exports = {
  saveFavorite,
  findAllFavorite,
  findFavoriteById,
  deleteFavorite,
  findFavoritesByCustomerId,
  isFavorite,
};
