const customerRepository = require("../repositories/customer.repository");
const validator = require("validator");

// Create a new customer
async function createCustomer(customerData) {
  const connection = await pool.getConnection();
  const { firstName, lastName, email, thumbnail, googleId } = customerData;

  const [result] = await connection.execute(
    "INSERT INTO customer (firstName, lastName, email, thumbnail, googleId) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, thumbnail, googleId]
  );

  connection.release();
  return result.insertId;
}

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

// Get all customers
async function getAllCustomer(req, res) {
  try {
    const customers = await customerRepository.findAllCustomer();
    return res.status(200).json(customers);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve customers", details: error.message });
  }
}

// Get customer by ID
async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await customerRepository.findCustomerById(id);
    return res.status(200).json(customer);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Customer not found", details: error.message });
  }
}

// Find customer by name
async function findCustomerByName(req, res) {
  const { name } = req.params;

  try {
    const customers = await customerRepository.findCustomerByName(name);
    return res.status(200).json(customers);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Customer not found", details: error.message });
  }
}

// Find customer by email
async function findCustomerByEmail(req, res) {
  const { email } = req.params;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  try {
    const customer = await customerRepository.findCustomerByEmail(email);
    return res.status(200).json(customer);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Customer not found", details: error.message });
  }
}

async function deleteCustomer(req, res) {
  const { id } = req.params;

  try {
    await customerRepository.deleteCustomer(id);
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Failed to delete customer", details: error.message });
  }
}

module.exports = {
  getAllCustomer,
  getCustomerById,
  findCustomerByName,
  findCustomerByEmail,
  deleteCustomer,
  createCustomer,
  updateCustomer,
};
