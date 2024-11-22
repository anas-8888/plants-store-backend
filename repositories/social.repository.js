const pool = require("../config/db");

// Create a new social platform
async function createNewSocial({ platform_name_AR, platform_name_EN, url }) {
      const connection = await pool.getConnection();
      try {
            const query = `INSERT INTO social (platform_name_AR, platform_name_EN, url) VALUES (?, ?, ?)`;
            await connection.execute(query, [platform_name_AR, platform_name_EN, url]);
      } catch (error) {
            console.error("Error creating social platform:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Get all social platforms
async function getAllSocials() {
      const connection = await pool.getConnection();
      try {
            const query = `SELECT * FROM social`;
            const [rows] = await connection.execute(query);
            return rows;
      } catch (error) {
            console.error("Error retrieving social platforms:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Get a social platform by ID
async function getSocialById(id) {
      const connection = await pool.getConnection();
      try {
            const query = `SELECT * FROM social WHERE id = ?`;
            const [rows] = await connection.execute(query, [id]);
            return rows.length ? rows[0] : null;
      } catch (error) {
            console.error("Error finding social platform by ID:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Delete a social platform by ID
async function deleteOneSocial(id) {
      const connection = await pool.getConnection();
      try {
            const query = `DELETE FROM social WHERE id = ?`;
            await connection.execute(query, [id]);
      } catch (error) {
            console.error("Error deleting social platform:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Update a social platform by ID
async function updateOneSocial({ id, platform_name_AR, platform_name_EN, url }) {
      const connection = await pool.getConnection();
      try {
            const query = `UPDATE social SET platform_name_AR = ?, platform_name_EN = ?, url = ? WHERE id = ?`;
            await connection.execute(query, [platform_name_AR, platform_name_EN, url, id]);
      } catch (error) {
            console.error("Error updating social platform:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

module.exports = {
      createNewSocial,
      getAllSocials,
      getSocialById,
      deleteOneSocial,
      updateOneSocial
};
