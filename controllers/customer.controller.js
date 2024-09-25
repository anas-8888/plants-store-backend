const customerRepository = require("../repositories/customer.repository");
const validator = require("validator");

// Create a new customer
async function createCustomer(req, res) {
  const { firstName, lastName, email, thumbnail, googleId } = req.body;

  if (!firstName || !lastName || !email || !googleId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if customer with the same email or Google ID exists
    const existingCustomer =
      await customerRepository.findCustomerByEmailOrGoogleId(email, googleId);
    if (existingCustomer) {
      return res
        .status(400)
        .json({
          error: "Customer with this email or Google ID already exists",
        });
    }

    // Create new customer
    const newCustomerId = await customerRepository.createCustomer({
      firstName,
      lastName,
      email,
      thumbnail,
      googleId,
    });

    return res
      .status(201)
      .json({
        message: "Customer created successfully",
        customerId: newCustomerId,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create customer", details: error.message });
  }
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

// Update customer information
async function updateCustomer(req, res) {
  const { id } = req.params;
  const { firstName, lastName, email, thumbnail, googleId } = req.body;

  if (!firstName || !lastName || !email || !googleId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const customer = await customerRepository.findCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const existingCustomer =
      await customerRepository.findCustomerByEmailOrGoogleId(
        email,
        googleId,
        id
      );
    if (existingCustomer) {
      return res
        .status(400)
        .json({
          error: "Another customer with this email or Google ID already exists",
        });
    }

    // Update the customer
    await customerRepository.updateCustomer(id, {
      firstName,
      lastName,
      email,
      thumbnail,
      googleId,
    });
    return res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update customer", details: error.message });
  }
}

// Delete customer by ID
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
  createCustomer,
  getAllCustomer,
  getCustomerById,
  findCustomerByName,
  findCustomerByEmail,
  updateCustomer,
  deleteCustomer,
  createCustomer,
  updateCustomer,
};
