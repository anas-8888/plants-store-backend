const pool = require("../config/db");

const contactMethodsRepository = {
  createContactMethod: async ({ phone, email, website }) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        INSERT INTO contact_methods (phone, email, website)
        VALUES (?, ?, ?)
      `;
      const [result] = await connection.execute(query, [phone, email, website]);
      return { id: result.insertId, phone, email, website };
    } catch (error) {
      console.error("Error in createContactMethod:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  getAllContactMethods: async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `SELECT * FROM contact_methods ORDER BY created_at DESC`;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error("Error in getAllContactMethods:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  getContactMethodById: async (id) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `SELECT * FROM contact_methods WHERE id = ?`;
      const [rows] = await connection.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("Error in getContactMethodById:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  updateContactMethod: async (id, { phone, email, website }) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        UPDATE contact_methods
        SET phone = ?, email = ?, website = ?
        WHERE id = ?
      `;
      const [result] = await connection.execute(query, [phone, email, website, id]);
      return { affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error in updateContactMethod:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  deleteContactMethod: async (id) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `DELETE FROM contact_methods WHERE id = ?`;
      await connection.execute(query, [id]);
    } catch (error) {
      console.error("Error in deleteContactMethod:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
};

module.exports = { contactMethodsRepository };
