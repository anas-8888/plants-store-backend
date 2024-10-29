const pool = require("../config/db");

// Create a new location
async function createNewLocation({ location_name_AR, location_name_EN, price }) {
      const connection = await pool.getConnection();
      try {
            const query = `INSERT INTO locations (location_name_AR, location_name_EN, price) VALUES (?, ?, ?)`;
            await connection.execute(query, [location_name_AR, location_name_EN, price]);
      } catch (error) {
            console.error("Error creating location:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Get all locations
async function getAllLocations() {
      const connection = await pool.getConnection();
      try {
            const query = `SELECT * FROM locations`;
            const [rows] = await connection.execute(query);
            return rows;
      } catch (error) {
            console.error("Error retrieving locations:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Get a location by ID
async function getLocationById(id) {
      const connection = await pool.getConnection();
      try {
            const query = `SELECT * FROM locations WHERE id = ?`;
            const [rows] = await connection.execute(query, [id]);
            return rows.length ? rows[0] : null;
      } catch (error) {
            console.error("Error finding location by ID:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Delete a location by ID
async function deleteOneLocation(id) {
      const connection = await pool.getConnection();
      try {
            const query = `DELETE FROM locations WHERE id = ?`;
            await connection.execute(query, [id]);
      } catch (error) {
            console.error("Error deleting location:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

// Update a location by ID
async function updateOneLocation({ id, location_name_AR, location_name_EN, price }) {
      const connection = await pool.getConnection();
      try {
            const query = `UPDATE locations SET location_name_AR = ?, location_name_EN = ?, price = ? WHERE id = ?`;
            await connection.execute(query, [location_name_AR, location_name_EN, price, id]);
      } catch (error) {
            console.error("Error updating location:", error.message);
            throw error;
      } finally {
            connection.release();
      }
}

module.exports = {
      createNewLocation,
      getAllLocations,
      getLocationById,
      deleteOneLocation,
      updateOneLocation
};
