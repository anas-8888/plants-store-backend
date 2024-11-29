const pool = require("../config/db");

async function savePlantTalk(plantTalkData) {
  try {
    const { description_AR, description_EN, photoPath } = plantTalkData;
    const connection = await pool.getConnection();

    const query = `
        INSERT INTO plantTalk (description_AR, description_EN, photoPath)
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
    console.error("Error creating plant talk:", error);
    throw error;
  }
}

async function findAllPlantTalks() {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantTalk`;
    const [rows] = await connection.execute(query);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error finding plantTalks:", error);
    throw error;
  }
}

async function findPlantTalkById(plantTalkId) {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM plantTalk WHERE id = ?`;
    const [rows] = await connection.execute(query, [plantTalkId]);
    connection.release();

    if (rows.length === 0) {
      throw new Error("Plant Talk Not Found!");
    }
    return rows[0];
  } catch (error) {
    console.error("Error finding plant Talk by ID:", error);
    throw error;
  }
}

async function updatePlantTalk(plantTalkData) {
  const { id, description_AR, description_EN, photoPath } = plantTalkData;

  try {
    const connection = await pool.getConnection();
    const query = `
        UPDATE plantTalk
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
        message: "Plant Talk Not Found or No Changes Made",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating Plant Talk:", error);
    throw error;
  }
}

async function deletePlantTalk(plantTalkId) {
  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM plantTalk WHERE id = ?`;

    const [result] = await connection.execute(query, [plantTalkId]);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error("Plant Talk Not Found or Already Deleted");
    }

    return result;
  } catch (error) {
    console.error("Error deleting plant talk:", error);
    throw error;
  }
}

module.exports = {
  savePlantTalk,
  findAllPlantTalks,
  findPlantTalkById,
  updatePlantTalk,
  deletePlantTalk,
};
