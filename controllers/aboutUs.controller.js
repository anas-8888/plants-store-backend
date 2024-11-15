const aboutUsRepository = require("../repositories/aboutUs.repository");
const fs = require("fs");

async function createAboutUs(req, res) {
  try {
    const { description_AR, description_EN } = req.body;

    if (!description_AR || !description_EN) {
      if (req.file) fs.unlinkSync(req.file.path);  // delete uploaded file if validation fails
      return res.status(400).json({
        error: "Both Arabic and English descriptions are required!",
      });
    }

    if (description_AR.length > 500 || description_EN.length > 500) {
      if (req.file) fs.unlinkSync(req.file.path);  // delete uploaded file if validation fails
      return res.status(400).json({
        error: "Descriptions should be within 500 characters.",
      });
    }

    const photoPath = req.file ? `uploads/aboutUs/${req.file.filename}` : null;

    const result = await aboutUsRepository.saveAboutUs({
      description_AR,
      description_EN,
      photoPath,
    });

    return res.status(201).json({
      message: "About Us section created successfully",
      aboutUsId: result.insertId,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);  // delete uploaded file in case of error
    return res.status(500).json({
      error: "Failed to create About Us section",
      details: error.message,
    });
  }
}

async function getAllAboutUs(req, res) {
  try {
    const aboutUsSections = await aboutUsRepository.findAllAboutUs();

    const language = req.language;

    const filteredAboutUs = aboutUsSections.map((aboutUs) => {
      return {
        id: aboutUs.id,
        description: language === "ar" ? aboutUs.description_AR : aboutUs.description_EN,
        photo: aboutUs.photoPath,
      };
    });

    return res.status(200).json(filteredAboutUs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve About Us sections",
      details: error.message,
    });
  }
}

async function getAboutUsById(req, res) {
  try {
    const { id } = req.params;
    const aboutUs = await aboutUsRepository.findAboutUsById(id);

    if (!aboutUs) {
      return res.status(404).json({ error: "About Us section not found" });
    }

    const language = req.language;  // Assuming language is set using middleware

    const response = {
      id: aboutUs.id,
      description: language === "ar" ? aboutUs.description_AR : aboutUs.description_EN,
      photo: aboutUs.photoPath,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve About Us section",
      details: error.message,
    });
  }
}

async function updateAboutUs(req, res) {
  const { id } = req.params;
  const { description_AR, description_EN } = req.body;
  const photoPath = req.file ? `uploads/aboutUs/${req.file.filename}` : null;

  try {
    const existingAboutUs = await aboutUsRepository.findAboutUsById(id);

    if (!existingAboutUs) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(404).json({ error: "About Us section not found!" });
    }

    if (!description_AR && !description_EN && !photoPath) {
      if (photoPath) fs.unlinkSync(photoPath);
      return res.status(400).json({ error: "Nothing to update!" });
    }

    if (photoPath && existingAboutUs.photoPath) {
      try {
        fs.unlinkSync(existingAboutUs.photoPath);
      } catch (err) {
        console.error("File deletion error:", err.message);
      }
    }

    const updatedData = {
      id,
      description_AR: description_AR || existingAboutUs.description_AR,
      description_EN: description_EN || existingAboutUs.description_EN,
      photoPath: photoPath || existingAboutUs.photoPath,
    };

    await aboutUsRepository.updateAboutUs(updatedData);

    return res.status(200).json({
      message: "About Us section updated successfully",
    });
  } catch (error) {
    if (photoPath) fs.unlinkSync(photoPath);
    return res.status(500).json({
      error: "Failed to update About Us section",
      details: error.message,
    });
  }
}

async function deleteAboutUs(req, res) {
  const { id } = req.params;

  try {
    const aboutUs = await aboutUsRepository.findAboutUsById(id);
    if (!aboutUs) {
      return res.status(404).json({ error: "About Us section not found!" });
    }

    await aboutUsRepository.deleteAboutUs(id);
    return res.status(200).json({ message: "About Us section deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete About Us section",
      details: error.message,
    });
  }
}

module.exports = {
  createAboutUs,
  getAllAboutUs,
  getAboutUsById,
  updateAboutUs,
  deleteAboutUs,
};
