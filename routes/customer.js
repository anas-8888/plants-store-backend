const express = require("express");
const {
  getAllCustomer,
  getCustomerById,
  deleteCustomer,
  findCustomerByName,
  findCustomerByEmail,
} = require("./../controllers/customer.controller");

const customer = express.Router();

customer.get("/findAllCustomer", getAllCustomer);
customer.get("/findCustomerById/:id", getCustomerById);
customer.get("/findCustomerByName/:name", findCustomerByName);
customer.get("/findCustomerByEmail/:email", findCustomerByEmail);
customer.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = customer;
