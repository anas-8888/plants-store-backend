const categoryRepository = require("../repositories/category.repository");
const fs = require("fs");
const path = require("path");

async function createCategory(req, res) {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: "Category name is required!" });
    }

    const photoPath = req.file ? req.file.path : null;
    const result = await categoryRepository.saveCategory({ category_name, photoPath });

    return res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create category",
      details: error.message,
    });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await categoryRepository.findAllCategories();
    const categoriesWithBase64Photos = categories.map((category) => {
      const base64Photo = category.photoPath
        ? fs.readFileSync(category.photoPath, { encoding: "base64" })
        : null;

      const { photoPath, ...categoryWithoutPhotoPath } = category;

      return { ...categoryWithoutPhotoPath, photo: base64Photo };
    });
    return res.status(200).json(categoriesWithBase64Photos);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve categories",
      details: error.message,
    });
  }
}



async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await categoryRepository.findCategoryById(id);

    if (category.photoPath) {
      category.photo = fs.readFileSync(category.photoPath, { encoding: "base64" });
    } else {
      category.photo = null;
    }

    const { photoPath, ...categoryWithoutPhotoPath } = category;

    return res.status(200).json(categoryWithoutPhotoPath);
  } catch (error) {
    return res.status(404).json({
      error: "Category not found",
      details: error.message,
    });
  }
}


async function findCategoryByName(req, res) {
  const { name } = req.params;
  try {
    const categories = await categoryRepository.findCategoryByName(name);

    const categoriesWithBase64Photos = categories.map((category) => {
      const base64Photo = category.photoPath
        ? fs.readFileSync(category.photoPath, { encoding: "base64" })
        : null;

      const { photoPath, ...categoryWithoutPhotoPath } = category;

      return { ...categoryWithoutPhotoPath, photo: base64Photo };
    });

    return res.status(200).json(categoriesWithBase64Photos);
  } catch (error) {
    return res.status(404).json({
      error: "Category not found",
      details: error.message,
    });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { category_name } = req.body;
  const photoPath = req.file ? req.file.path : null;

  try {
    const existingCategory = await categoryRepository.findCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found!" });
    }

    if (!category_name && !photoPath) {
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingCategory.photoPath) {
      fs.unlinkSync(existingCategory.photoPath);
    }

    const updatedData = {
      id,
      category_name: category_name || existingCategory.category_name,
      photoPath: photoPath || existingCategory.photoPath,
    };

    const result = await categoryRepository.updateCategory(updatedData);

    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update category",
      details: error.message,
    });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const category = await categoryRepository.findCategoryById(id);
    if (category.photoPath) {
      fs.unlinkSync(category.photoPath);
    }

    await categoryRepository.deleteCategory(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete category",
      details: error.message,
    });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  findCategoryByName,
};
