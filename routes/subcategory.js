const express = require("express");
const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  getSubcategoryByName,
  updateSubcategory,
  deleteSubcategory,
} = require("./../controllers/subcategory.controller");
const upload = require("../middleware/uploadSubcategory");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const subCategory = express.Router();

subCategory.post("/createSubcategory", isAdmin, upload, createSubcategory);
subCategory.get("/findAllSubcategory", getAllSubcategories);
subCategory.get("/findSubcategoryById/:id", getSubcategoryById);
subCategory.get("/findSubcategoryByName/:name", getSubcategoryByName);
subCategory.put("/updateSubcategory/:id", isAdmin, upload, updateSubcategory);
subCategory.delete("/deleteSubcategory/:id", isAdmin, deleteSubcategory);

module.exports = subCategory;
