const pool = require("../config/db");

async function savePlantPress(plantPressData) {
  try {
    const { description_AR, description_EN, photoPath } = plantPressData;
    const connection = await pool.getConnection();

    const query = `
        INSERT INTO plantPress (description_AR, description_EN, photoPath)
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
    console.error("Error creating plant press:", error);
    throw error;
  }
}

async function findAllPlantPresses() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantPress`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding PlantPresses:", error);
    throw error;
  }
}

async function findPlantPressById(plantPressId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantPress WHERE id = ?`;
    const [rows] = await connection.execute(query, [plantPressId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Plant Press Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding plant Press by ID:", error);
    throw error;
  }
}

async function updatePlantPress(plantPressData) {
  const { id, description_AR, description_EN, photoPath } = plantPressData;

  try {
    const connection = await pool.getConnection();
    const query = `
        UPDATE plantPress
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
        message: "Plant Press Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Plant Press:", error);
    throw error;
  }
}

async function deletePlantPress(plantPressId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM plantPress WHERE id = ?`;

    const [result] = await connection.execute(query, [plantPressId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Plant Press Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting plant press:", error);
    throw error;
  }
}

module.exports = {
  savePlantPress,
  findAllPlantPresses,
  findPlantPressById,
  updatePlantPress,
  deletePlantPress,
};
