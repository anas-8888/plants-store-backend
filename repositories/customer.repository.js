const pool = require("../config/db");

// Create a new customer
async function createCustomer(customerData) {
  const connection = await pool.getConnection();
  const { firstName, lastName, email, thumbnail, googleId, is_admin } = customerData;

  const [result] = await connection.execute(
    'INSERT INTO customer (firstName, lastName, email, thumbnail, googleId, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, thumbnail, googleId, is_admin] 
  );

  connection.release();
  return result.insertId;
}


// Find all customers
async function findAllCustomer() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM customer");
  connection.release();
  return rows;
}

// Find customer by ID
async function findCustomerById(id) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM customer WHERE id = ?", [
    id,
  ]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Find customer by GoogleID
async function findCustomerByGoogleId(googleId) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM customer WHERE googleId = ?",
    [googleId]
  );
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Find customer by name
async function findCustomerByName(name) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM customer WHERE firstName LIKE ? OR lastName LIKE ?",
    [`%${name}%`, `%${name}%`]
  );
  connection.release();
  return rows;
}

// Find customer by email
async function findCustomerByEmail(email) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM customer WHERE email = ?",
    [email]
  );
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Update customer by ID
async function updateCustomer(id, customerData) {
  const connection = await pool.getConnection();
  const { firstName, lastName, email, thumbnail, googleId, is_admin } = customerData;
  try {
    await connection.execute(
      'UPDATE customer SET firstName = ?, lastName = ?, email = ?, thumbnail = ?, googleId = ?, is_admin = ? WHERE id = ?',
      [firstName, lastName, email, thumbnail, googleId, is_admin, id]
    );
  } catch (error) {
    console.error("Error updating customer:", error.message);
    throw error; // Ensure error handling bubbles up
  } finally {
    connection.release();
  }
}

// Delete customer by ID
async function deleteCustomer(id) {
  const connection = await pool.getConnection();
  await connection.execute("DELETE FROM customer WHERE id = ?", [id]);
  connection.release();
}

module.exports = {
  createCustomer,
  findAllCustomer,
  findCustomerById,
  findCustomerByGoogleId,
  findCustomerByName,
  findCustomerByEmail,
  updateCustomer,
  deleteCustomer
};
