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
const { isAdmin } = require("../middleware/isAdmin");

const category = express.Router();

category.post("/createCategory", isAdmin, upload, createCategory);
category.get("/findAllCategories", getAllCategories);
category.get("/findCategoryById/:id", getCategoryById);
category.get("/findCategoryByName/:name", findCategoryByName);
category.put("/updateCategory/:id", isAdmin, upload, updateCategory);
category.delete("/deleteCategory/:id", isAdmin, deleteCategory);

module.exports = category;
