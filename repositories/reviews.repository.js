const pool = require("../config/db");

// Create a new review
async function createNewReview({ customer_name_AR, customer_name_EN, message_AR, message_EN, rate }) {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO reviews (customer_name_AR, customer_name_EN, message_AR, message_EN, rate) VALUES (?, ?, ?, ?, ?)`;
    await connection.execute(query, [customer_name_AR, customer_name_EN, message_AR, message_EN, rate]);
  } catch (error) {
    console.error("Error creating review:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get all reviews
async function getAllReviews() {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM reviews`;
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error("Error retrieving reviews:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get a review by ID
async function getReviewById(id) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM reviews WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error finding review by ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Delete a review by ID
async function deleteOneReview(id) {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM reviews WHERE id = ?`;
    await connection.execute(query, [id]);
  } catch (error) {
    console.error("Error deleting review:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Update a review by ID
async function updateOneReview({ id, customer_name_AR, customer_name_EN, message_AR, message_EN, rate }) {
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE reviews SET customer_name_AR = ?, customer_name_EN = ?, message_AR = ?, message_EN = ?, rate = ? WHERE id = ?`;
    await connection.execute(query, [customer_name_AR, customer_name_EN, message_AR, message_EN, rate, id]);
  } catch (error) {
    console.error("Error updating review:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createNewReview,
  getAllReviews,
  getReviewById,
  deleteOneReview,
  updateOneReview
};
