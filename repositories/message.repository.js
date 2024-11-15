const pool = require("../config/db");

const messageRepository = {
  createMessage: async ({ name, email, phone, message }) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        INSERT INTO messages (name, email, phone, message)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [name, email, phone, message]);
      return { id: result.insertId, name, email, phone, message };
    } catch (error) {
      console.error("Error in createMessage:", error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      if (connection) connection.release();
    }
  },

  getAllMessages: async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `SELECT * FROM messages ORDER BY created_at DESC`;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error("Error in getAllMessages:", error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      if (connection) connection.release();
    }
  },

  getMessageById: async (id) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `SELECT * FROM messages WHERE id = ?`;
      const [rows] = await connection.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("Error in getMessageById:", error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      if (connection) connection.release();
    }
  }
};

module.exports = { messageRepository };
