const logoRepository = require("../repositories/logo.repository");

const createLogo = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: "File is required." });

    const photoPath = `/uploads/logos/${file.filename}`;
    const result = await logoRepository.createLogo(photoPath);
    res.status(201).json({ message: "Logo created successfully.", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error creating logo.", error: error.message });
  }
};

const findAllLogos = async (req, res) => {
  try {
    const logos = await logoRepository.findAllLogos();
    res.status(200).json({ data: logos });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logos.", error: error.message });
  }
};

const findLogoById = async (req, res) => {
  try {
    const { id } = req.params;
    const logo = await logoRepository.findLogoById(id);

    if (!logo) return res.status(404).json({ message: "Logo not found." });

    res.status(200).json({ data: logo });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logo.", error: error.message });
  }
};

const findAcctiveLogo = async (req, res) => {
  try {
    const logo = await logoRepository.findAcctiveLogo();

    if (!logo) return res.status(404).json({ message: "No active logo found." });

    res.status(200).json({ data: logo });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active logo.", error: error.message });
  }
};

const updateLogoAcctive = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await logoRepository.updateLogoAcctive(id);

    if (!result) return res.status(404).json({ message: "Logo not found or already active." });

    res.status(200).json({ message: "Logo updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating logo.", error: error.message });
  }
};

const deleteLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await logoRepository.deleteLogo(id);

    if (!result) return res.status(404).json({ message: "Logo not found." });

    res.status(200).json({ message: "Logo deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting logo.", error: error.message });
  }
};

module.exports = {
  createLogo,
  findAllLogos,
  findLogoById,
  findAcctiveLogo,
  updateLogoAcctive,
  deleteLogo,
};
