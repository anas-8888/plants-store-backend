const pool = require("../config/db");
const validator = require("validator");

// Save Subcategory
async function saveSubcategory(subcategoryData) {
  const { subcategory_name_EN, subcategory_name_AR, category_id, photoPath } =
    subcategoryData;

  if (!subcategory_name_EN || typeof subcategory_name_EN !== "string") {
    throw new Error(
      "Subcategory English name is required and must be a string."
    );
  }

  if (!subcategory_name_AR || typeof subcategory_name_AR !== "string") {
    throw new Error(
      "Subcategory Arabic name is required and must be a string."
    );
  }

  if (!validator.isInt(String(category_id))) {
    throw new Error("Category ID must be a valid integer.");
  }

  try {
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO subcategory (subcategory_name_EN, subcategory_name_AR, category_id, photoPath)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      subcategory_name_EN,
      subcategory_name_AR,
      category_id,
      photoPath,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
}

// Find All Subcategories
async function findAllSubcategories() {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM subcategory
    `;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding subcategories:", error);
    throw error;
  }
}

// Find Subcategory By ID
async function findSubcategoryById(subcategoryId) {
  if (!validator.isInt(String(subcategoryId))) {
    throw new Error("Subcategory ID must be a valid integer.");
  }

  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM subcategory WHERE id = ?
    `;
    const [rows] = await connection.execute(query, [subcategoryId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Subcategory Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding subcategory by ID:", error);
    throw error;
  }
}

// Find Subcategory By name
async function findSubcategoryByName(name) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM subcategory WHERE subcategory_name_EN LIKE ? OR subcategory_name_AR LIKE ?`;
    const [rows] = await connection.execute(query, [`%${name}%`, `%${name}%`]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("No subcategories found with the given name.");
    }

    return rows;
  } catch (error) {
    console.error("Error finding subcategory by name:", error);
    throw error;
  }
}

// Update Subcategory
async function updateSubcategory(subcategoryData) {
  const {
    id,
    subcategory_name_EN,
    subcategory_name_AR,
    category_id,
    photoPath,
  } = subcategoryData;

  if (!validator.isInt(String(id))) {
    throw new Error("Subcategory ID must be a valid integer.");
  }

  if (category_id !== undefined && !validator.isInt(String(category_id))) {
    throw new Error("Category ID must be a valid integer.");
  }

  try {
    const connection = await pool.getConnection();
    const query = `
      UPDATE subcategory
      SET subcategory_name_EN = ?, subcategory_name_AR = ?, category_id = ?, photoPath = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      subcategory_name_EN,
      subcategory_name_AR,
      category_id,
      photoPath,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Subcategory Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
}

// Delete Subcategory
async function deleteSubcategory(subcategoryId) {
  if (!validator.isInt(String(subcategoryId))) {
    throw new Error("Subcategory ID must be a valid integer.");
  }

  try {
    const connection = await pool.getConnection();
    const query = `
      DELETE FROM subcategory WHERE id = ?
    `;
    const [result] = await connection.execute(query, [subcategoryId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Subcategory Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
}

module.exports = {
  saveSubcategory,
  findAllSubcategories,
  findSubcategoryById,
  findSubcategoryByName,
  updateSubcategory,
  deleteSubcategory,
};
