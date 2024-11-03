const express = require("express");
const {
  getAllCustomer,
  getMyInfo,
  getCustomerById,
  deleteCustomer,
  findCustomerByName,
  findCustomerByEmail,
  updateCustomerRole
} = require("./../controllers/customer.controller");
const { isAdmin } = require("../middleware/isAdmin");
const { isCustomer } = require("../middleware/isCustomer");

const customer = express.Router();

customer.get("/findAllCustomer", isAdmin, getAllCustomer);
customer.get("/findMyInfo", isCustomer, getMyInfo);
customer.get("/findCustomerById/:id", isAdmin, getCustomerById);
customer.get("/findCustomerByName/:name", isAdmin, findCustomerByName);
customer.get("/findCustomerByEmail/:email", isAdmin, findCustomerByEmail);
customer.put("/updateCustomerRole/:id", isAdmin, updateCustomerRole);
customer.delete("/deleteCustomer/:id", isAdmin, deleteCustomer);

module.exports = customer;
