const express = require("express");
const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} = require("./../controllers/subcategory.controller");

const subCategory = express.Router();

subCategory.post("/createSubcategory", createSubcategory);
subCategory.get("/findAllSubcategory", getAllSubcategories);
subCategory.get("/findSubcategoryById/:id", getSubcategoryById);
subCategory.put("/updateSubcategory/:id", updateSubcategory);
subCategory.delete("/deleteSubcategory/:id", deleteSubcategory);

module.exports = subCategory;
