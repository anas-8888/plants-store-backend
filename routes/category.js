const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  findCategoryByName,
} = require("./../controllers/category.controller");
const upload = require("../middleware/uploadCategory");

const category = express.Router();

category.post("/createCategory", upload, createCategory);
category.get("/findAllCategories", getAllCategories);
category.get("/findCategoryById/:id", getCategoryById);
category.get("/findCategoryByName/:name", findCategoryByName);
category.put("/updateCategory/:id", upload, updateCategory);
category.delete("/deleteCategory/:id", deleteCategory);

module.exports = category;
