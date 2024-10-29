const express = require("express");
const {
  getAllCustomer,
  getCustomerById,
  deleteCustomer,
  findCustomerByName,
  findCustomerByEmail,
} = require("./../controllers/customer.controller");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const customer = express.Router();

customer.get("/findAllCustomer", isAdmin, getAllCustomer);
customer.get("/findCustomerById/:id", isAdmin, getCustomerById);
customer.get("/findCustomerByName/:name", isAdmin, findCustomerByName);
customer.get("/findCustomerByEmail/:email", isAdmin, findCustomerByEmail);
customer.delete("/deleteCustomer/:id", isAdmin, deleteCustomer);

module.exports = customer;
