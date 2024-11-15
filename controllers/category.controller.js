const categoryRepository = require("../repositories/category.repository");
const fs = require("fs");

async function createCategory(req, res) {
  try {
    const { category_name_AR, category_name_EN } = req.body;

    if (!category_name_AR || !category_name_EN) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Both Arabic and English category names are required!",
      });
    }

    if (category_name_AR.length > 100 || category_name_EN.length > 100) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Category names should be within 100 characters.",
      });
    }

    const photoPath = req.file
    ? `uploads/category/${req.file.filename}`
    : null;

    const result = await categoryRepository.saveCategory({
      category_name_AR,
      category_name_EN,
      photoPath,
    });

    return res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      error: "Failed to create category",
      details: error.message,
    });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await categoryRepository.findAllCategories();
    const language = req.language;

    const filteredCategories = categories.map((category) => {
      if (language === "ar") {
        return {
          id: category.id,
          category_name: category.category_name_AR,
          photo: category.photoPath,
        };
      } else {
        return {
          id: category.id,
          category_name: category.category_name_EN,
          photo: category.photoPath,
        };
      }
    });

    return res.status(200).json(filteredCategories);
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

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const language = req.language;

    const responseCategory = {
      id: category.id,
      photo: category.photoPath,
    };

    if (language === "ar") {
      responseCategory.category_name = category.category_name_AR;
    } else {
      responseCategory.category_name = category.category_name_EN;
    }

    return res.status(200).json(responseCategory);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve category",
      details: error.message,
    });
  }
}

async function findCategoryByName(req, res) {
  const { name } = req.params;
  try {
    const categories = await categoryRepository.findCategoryByName(name);

    const language = req.language;

    const categoriesWithPhotos = categories.map((category) => {
      const responseCategory = {
        id: category.id,
        photo: category.photoPath,
      };

      if (language === "ar") {
        responseCategory.category_name = category.category_name_AR;
      } else {
        responseCategory.category_name = category.category_name_EN;
      }

      return responseCategory;
    });

    return res.status(200).json(categoriesWithPhotos);
  } catch (error) {
    return res.status(404).json({
      error: "Category not found",
      details: error.message,
    });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { category_name_AR, category_name_EN } = req.body;
  const photoPath = req.file
    ? `uploads/category/${req.file.filename}`
    : null;

  try {
    const existingCategory = await categoryRepository.findCategoryById(id);
    
    if (!existingCategory) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(404).json({ error: "Category not found!" });
    }

    if (!category_name_AR && !category_name_EN && !photoPath) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingCategory.photoPath) {
      try {
        fs.unlinkSync(existingCategory.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      category_name_AR: category_name_AR || existingCategory.category_name_AR,
      category_name_EN: category_name_EN || existingCategory.category_name_EN,
      photoPath: photoPath || existingCategory.photoPath,
    };

    await categoryRepository.updateCategory(updatedData);

    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);
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
    if (!category) {
      return res.status(404).json({ error: "Category not found!" });
    }

    await categoryRepository.deleteCategory(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({
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
