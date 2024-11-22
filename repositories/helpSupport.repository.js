const pool = require("../config/db");

// Create a Help and Support entry
async function createHelpSupport({ title_AR, title_EN, description_AR, description_EN }) {
  const connection = await pool.getConnection();
  try {
    const query = `INSERT INTO help_support (title_AR, title_EN, description_AR, description_EN) VALUES (?, ?, ?, ?)`;
    await connection.execute(query, [title_AR, title_EN, description_AR, description_EN]);
  } catch (error) {
    console.error("Error creating Help and Support entry:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get all Help and Support entries
async function getAllHelpSupport() {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM help_support`;
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error("Error retrieving Help and Support entries:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get a Help and Support entry by ID
async function getHelpSupportById(id) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT * FROM help_support WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error finding Help and Support entry by ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Update a Help and Support entry by ID
async function updateHelpSupport(id, { title_AR, title_EN, description_AR, description_EN }) {
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE help_support SET title_AR = ?, title_EN = ?, description_AR = ?, description_EN = ? WHERE id = ?`;
    await connection.execute(query, [title_AR, title_EN, description_AR, description_EN, id]);
  } catch (error) {
    console.error("Error updating Help and Support entry:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Delete a Help and Support entry by ID
async function deleteHelpSupport(id) {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM help_support WHERE id = ?`;
    await connection.execute(query, [id]);
  } catch (error) {
    console.error("Error deleting Help and Support entry:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createHelpSupport,
  getAllHelpSupport,
  getHelpSupportById,
  updateHelpSupport,
  deleteHelpSupport,
};
