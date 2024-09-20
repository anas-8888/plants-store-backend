const pool = require("../config/db");

// Find all customers
async function findAllCustomer() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM customer');
  connection.release();
  return rows;
}

// Find customer by ID
async function findCustomerById(id) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM customer WHERE id = ?', [id]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Find customer by GoogleID
async function findCustomerByGoogleId(googleId) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM customer WHERE googleId = ?', [googleId]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Find customer by name
async function findCustomerByName(name) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    'SELECT * FROM customer WHERE firstName LIKE ? OR lastName LIKE ?', 
    [`%${name}%`, `%${name}%`]
  );
  connection.release();
  return rows;
}

// Find customer by email
async function findCustomerByEmail(email) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM customer WHERE email = ?', [email]);
  connection.release();
  return rows.length > 0 ? rows[0] : null;
}

// Delete customer by ID
async function deleteCustomer(id) {
  const connection = await pool.getConnection();
  await connection.execute('DELETE FROM customer WHERE id = ?', [id]);
  connection.release();
}

module.exports = {
  findAllCustomer,
  findCustomerById,
  findCustomerByGoogleId,
  findCustomerByName,
  findCustomerByEmail,
  deleteCustomer,
};
