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

const subCategory = express.Router();

subCategory.post("/createSubcategory", upload, createSubcategory);
subCategory.get("/findAllSubcategory", getAllSubcategories);
subCategory.get("/findSubcategoryById/:id", getSubcategoryById);
subCategory.get("/findSubcategoryByName/:name", getSubcategoryByName);
subCategory.put("/updateSubcategory/:id", upload, updateSubcategory);
subCategory.delete("/deleteSubcategory/:id", deleteSubcategory);

module.exports = subCategory;
