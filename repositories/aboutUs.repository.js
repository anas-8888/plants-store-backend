const pool = require("../config/db");

async function saveAboutUs(aboutUsData) {
  try {
    const { description_AR, description_EN, photoPath } = aboutUsData;
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO about_us (description_AR, description_EN, photoPath)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      description_AR,
      description_EN,
      photoPath,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating About Us section:", error);
    throw error;
  }
}

async function findAllAboutUs() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM about_us`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding About Us sections:", error);
    throw error;
  }
}

async function findAboutUsById(id) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM about_us WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("About Us section not found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding About Us by ID:", error);
    throw error;
  }
}

async function updateAboutUs(aboutUsData) {
  const { id, description_AR, description_EN, photoPath } = aboutUsData;

  try {
    const connection = await pool.getConnection();
    const query = `
      UPDATE about_us
      SET description_AR = ?, description_EN = ?, photoPath = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      description_AR,
      description_EN,
      photoPath,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "About Us section not found or no changes made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating About Us section:", error);
    throw error;
  }
}

async function deleteAboutUs(id) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM about_us WHERE id = ?`;

    const [result] = await connection.execute(query, [id]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("About Us section not found or already deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting About Us section:", error);
    throw error;
  }
}

module.exports = {
  saveAboutUs,
  findAllAboutUs,
  findAboutUsById,
  updateAboutUs,
  deleteAboutUs,
};
