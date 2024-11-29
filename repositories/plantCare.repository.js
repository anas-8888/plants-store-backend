const pool = require("../config/db");

async function savePlantCare(plantCareData) {
  try {
    const { description_AR, description_EN, photoPath } = plantCareData;
    const connection = await pool.getConnection();

    const query = `
        INSERT INTO plantCare (description_AR, description_EN, photoPath)
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
    console.error("Error creating plant care:", error);
    throw error;
  }
}

async function findAllPlantCares() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantCare`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding plantCares:", error);
    throw error;
  }
}

async function findPlantCareById(plantCareId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantCare WHERE id = ?`;
    const [rows] = await connection.execute(query, [plantCareId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Plant Care Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding plant Care by ID:", error);
    throw error;
  }
}

async function updatePlantCare(plantCareData) {
  const { id, description_AR, description_EN, photoPath } = plantCareData;

  try {
    const connection = await pool.getConnection();
    const query = `
        UPDATE plantCare
        SET description_AR = ?,description_EN = ?, photoPath = ?
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
        message: "Plant Care Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Plant Care:", error);
    throw error;
  }
}

async function deletePlantCare(plantCareId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM plantCare WHERE id = ?`;

    const [result] = await connection.execute(query, [plantCareId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Plant Care Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting plant care:", error);
    throw error;
  }
}

module.exports = {
  savePlantCare,
  findAllPlantCares,
  findPlantCareById,
  updatePlantCare,
  deletePlantCare,
};
