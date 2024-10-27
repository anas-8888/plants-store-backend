const pool = require("../config/db");

async function saveCategory(categoryData) {
  try {
    const { category_name_AR, category_name_EN, photoPath } = categoryData;
    const connection = await pool.getConnection();

    const query = `
      INSERT INTO category (category_name_AR,category_name_EN, photoPath)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      category_name_AR,
      category_name_EN,
      photoPath,
    ]);
    connection.release();
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

async function findAllCategories() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM category`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding categories:", error);
    throw error;
  }
}

async function findCategoryById(categoryId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM category WHERE id = ?`;
    const [rows] = await connection.execute(query, [categoryId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Category Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding category by ID:", error);
    throw error;
  }
}

async function findCategoryByName(name) {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT *
      FROM category
      WHERE category_name_AR LIKE ? OR category_name_EN LIKE ?
    `;
    const [rows] = await connection.execute(query, [`%${name}%`, `%${name}%`]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("No categories found with the given name.");
    }

    return rows;
  } catch (error) {
    console.error("Error finding category by name:", error);
    throw error;
  }
}

async function updateCategory(categoryData) {
  const { id, category_name_AR, category_name_EN, photoPath } = categoryData;

  try {
    const connection = await pool.getConnection();
    const query = `
      UPDATE category
      SET category_name_AR = ?,category_name_EN = ?, photoPath = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      category_name_AR,
      category_name_EN,
      photoPath,
      id,
    ]);
    connection.release();

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Category Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

async function deleteCategory(categoryId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM category WHERE id = ?`;

    const [result] = await connection.execute(query, [categoryId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Category Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

module.exports = {
  saveCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
  findCategoryByName,
};
