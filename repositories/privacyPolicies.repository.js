const pool = require("../config/db");

// Create a new Privacy Policy
async function createPrivacyPolicy({ content_AR, content_EN }) {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO privacy_policies (content_AR, content_EN) VALUES (?, ?)`;
    await connection.execute(query, [content_AR, content_EN]);
  } catch (error) {
    console.error("Error creating Privacy Policy:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get all Privacy Policies
async function getAllPrivacyPolicies() {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM privacy_policies`;
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error("Error retrieving Privacy Policies:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get a Privacy Policy by ID
async function getPrivacyPolicyById(id) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM privacy_policies WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error finding Privacy Policy by ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Update a Privacy Policy by ID
async function updatePrivacyPolicy(id, { content_AR, content_EN }) {
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE privacy_policies SET content_AR = ?, content_EN = ? WHERE id = ?`;
    await connection.execute(query, [content_AR, content_EN, id]);
  } catch (error) {
    console.error("Error updating Privacy Policy:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Delete a Privacy Policy by ID
async function deletePrivacyPolicy(id) {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM privacy_policies WHERE id = ?`;
    await connection.execute(query, [id]);
  } catch (error) {
    console.error("Error deleting Privacy Policy:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createPrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
