const pool = require("../config/db");

<<<<<<< HEAD
=======
// Create a new customer
>>>>>>> 549333a8cbe8a9dd5e99b8c623397f2fb752a83c
async function createCustomer(customerData) {
  const connection = await pool.getConnection();
  const { firstName, lastName, email, thumbnail, googleId } = customerData;

  const [result] = await connection.execute(
<<<<<<< HEAD
    "INSERT INTO customer (firstName, lastName, email, thumbnail, googleId) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, thumbnail, googleId]
  );

=======
    'INSERT INTO customer (firstName, lastName, email, thumbnail, googleId) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, email, thumbnail, googleId]
  );
  
>>>>>>> 549333a8cbe8a9dd5e99b8c623397f2fb752a83c
  connection.release();
  return result.insertId;
}

<<<<<<< HEAD
// Update customer by ID
async function updateCustomer(id, customerData) {
  const connection = await pool.getConnection();
  const { firstName, lastName, email, thumbnail, googleId } = customerData;

  await connection.execute(
    "UPDATE customer SET firstName = ?, lastName = ?, email = ?, thumbnail = ?, googleId = ? WHERE id = ?",
    [firstName, lastName, email, thumbnail, googleId, id]
  );

  connection.release();
}

=======
>>>>>>> 549333a8cbe8a9dd5e99b8c623397f2fb752a83c
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
  const { firstName, lastName, email, thumbnail, googleId } = customerData;

  await connection.execute(
    'UPDATE customer SET firstName = ?, lastName = ?, email = ?, thumbnail = ?, googleId = ? WHERE id = ?',
    [firstName, lastName, email, thumbnail, googleId, id]
  );
  
  connection.release();
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
  deleteCustomer,
  createCustomer,
  updateCustomer,
};
