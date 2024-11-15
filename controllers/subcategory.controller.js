const subcategoryRepository = require("../repositories/subcategory.repository");
const validator = require("validator");
const fs = require("fs");

// Create Subcategory
async function createSubcategory(req, res) {
  const { subcategory_name_EN, subcategory_name_AR, category_id } = req.body;
  const photoPath = req.file
    ? `uploads/subcategory/${req.file.filename}`
    : null;

  if (!subcategory_name_EN || !subcategory_name_AR || !category_id) {
    return res.status(400).json({ error: "All Fields are Required!" });
  }

  if (!validator.isInt(String(category_id))) {
    return res.status(400).json({ error: "Invalid Category ID!" });
  }

  try {
    const result = await subcategoryRepository.saveSubcategory({
      subcategory_name_EN,
      subcategory_name_AR,
      category_id,
      photoPath,
    });

    return res.status(201).json({
      message: "Subcategory created successfully",
      subcategoryId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create subcategory",
      details: error.message,
    });
  }
}

// Get All Subcategories
async function getAllSubcategories(req, res) {
  const language = req.language;

  try {
    const subcategories = await subcategoryRepository.findAllSubcategories();
    const subcategoriesWithPhotos = subcategories.map((subcategory) => {

      const { photoPath, ...subcategoryWithoutPhotoPath } = subcategory;

      // Choose the right subcategory name based on language
      const subcategoryData = {
        id: subcategory.id,
        category_id: subcategory.category_id,
        photo: subcategory.photoPath,
      };

      if (language === "ar") {
        subcategoryData.subcategory_name = subcategory.subcategory_name_AR;
      } else {
        subcategoryData.subcategory_name = subcategory.subcategory_name_EN;
      }

      return subcategoryData;
    });

    return res.status(200).json(subcategoriesWithPhotos);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve subcategories",
      details: error.message,
    });
  }
}

// Get Subcategory By ID
async function getSubcategoryById(req, res) {
  const { id } = req.params;
  const language = req.language;

  try {
    const subcategory = await subcategoryRepository.findSubcategoryById(id);

    const { photoPath, ...subcategoryWithoutPhotoPath } = subcategory;

    // Choose the right subcategory name based on language
    const subcategoryData = {
      id: subcategoryWithoutPhotoPath.id,
      category_id: subcategoryWithoutPhotoPath.category_id,
      photo: subcategory.photoPath,
    };

    if (language === "ar") {
      subcategoryData.subcategory_name =
        subcategoryWithoutPhotoPath.subcategory_name_AR;
    } else {
      subcategoryData.subcategory_name =
        subcategoryWithoutPhotoPath.subcategory_name_EN;
    }

    return res.status(200).json(subcategoryData);
  } catch (error) {
    return res.status(404).json({
      error: "Subcategory not found",
      details: error.message,
    });
  }
}

async function getSubcategoryByName(req, res) {
  const { name } = req.params;
  const language = req.language;

  try {
    const subcategories = await subcategoryRepository.findSubcategoryByName(
      name
    );
    const subcategoriesWithPhotos = subcategories.map((subcategory) => {
      const { photoPath, ...subcategoryWithoutPhotoPath } = subcategory;

      // Choose the right subcategory name based on language
      const subcategoryData = {
        id: subcategoryWithoutPhotoPath.id,
        category_id: subcategoryWithoutPhotoPath.category_id,
        photo: subcategory.photoPath,
      };

      if (language === "ar") {
        subcategoryData.subcategory_name =
          subcategoryWithoutPhotoPath.subcategory_name_AR;
      } else {
        subcategoryData.subcategory_name =
          subcategoryWithoutPhotoPath.subcategory_name_EN;
      }

      return subcategoryData;
    });

    return res.status(200).json(subcategoriesWithPhotos);
  } catch (error) {
    return res.status(404).json({
      error: "Subcategory not found",
      details: error.message,
    });
  }
}

// Update Subcategory
async function updateSubcategory(req, res) {
  const { id } = req.params;
  const { subcategory_name_EN, subcategory_name_AR, category_id } = req.body;
  const photoPath = req.file
    ? `uploads/subcategory/${req.file.filename}`
    : null;

  if (
    subcategory_name_EN === undefined &&
    subcategory_name_AR === undefined &&
    category_id === undefined &&
    !req.file
  ) {
    return res.status(400).json({
      error:
        "At least one field (subcategory_name_EN, subcategory_name_AR, category_id, or photo) is required!",
    });
  }

  if (category_id !== undefined && !validator.isInt(String(category_id))) {
    return res.status(400).json({ error: "Invalid Category ID!" });
  }

  try {
    const subcategory = await subcategoryRepository.findSubcategoryById(id);

    if (subcategory.photoPath && photoPath) {
      fs.unlinkSync(subcategory.photoPath);
    }

    const updatedData = {};
    updatedData.subcategory_name_EN =
      subcategory_name_EN || subcategory.subcategory_name_EN;
    updatedData.subcategory_name_AR =
      subcategory_name_AR || subcategory.subcategory_name_AR;
    updatedData.category_id = category_id || subcategory.category_id;
    updatedData.photoPath = photoPath || subcategory.photoPath;

    const result = await subcategoryRepository.updateSubcategory({
      id,
      ...updatedData,
    });

    if (result.success) {
      return res.status(200).json({
        message: "Subcategory updated.",
      });
    } else {
      return res.status(400).json({
        error: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update subcategory",
      details: error.message,
    });
  }
}

// Delete Subcategory
async function deleteSubcategory(req, res) {
  const { id } = req.params;
  try {
    const subcategory = await subcategoryRepository.findSubcategoryById(id);
    if (!subcategory) {
      return res.status(404).json({ error: "subcategory not found!" });
    }
    
    await subcategoryRepository.deleteSubcategory(id);

    return res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to delete subcategory",
      details: error.message,
    });
  }
}

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  getSubcategoryByName,
  updateSubcategory,
  deleteSubcategory,
};
