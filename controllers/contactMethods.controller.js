const { contactMethodsRepository } = require("../repositories/contactMethods.repository");

const contactMethodsController = {
  createContactMethod: async (req, res) => {
    try {
      const { phone, email, website } = req.body;

      // Validation
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
      }
      if (phone && !/^\d{10,15}$/.test(phone)) {
        return res.status(400).json({ success: false, error: "Phone must be a valid number with 10-15 digits" });
      }
      if (website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(website)) {
        return res.status(400).json({ success: false, error: "Invalid website URL" });
      }

      const result = await contactMethodsRepository.createContactMethod({ phone, email, website });
      res.status(201).json({ success: true, message: "Contact method created successfully", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to create contact method" });
    }
  },

  getAllContactMethods: async (req, res) => {
    try {
      const contactMethods = await contactMethodsRepository.getAllContactMethods();
      res.status(200).json({ success: true, data: contactMethods });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to retrieve contact methods" });
    }
  },

  getContactMethodById: async (req, res) => {
    try {
      const { id } = req.params;
      const contactMethod = await contactMethodsRepository.getContactMethodById(id);
      if (!contactMethod) {
        return res.status(404).json({ success: false, error: "Contact method not found" });
      }
      res.status(200).json({ success: true, data: contactMethod });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to retrieve contact method" });
    }
  },

  updateContactMethod: async (req, res) => {
    try {
      const { id } = req.params;
      const { phone, email, website } = req.body;

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
      }
      if (phone && !/^\d{10,15}$/.test(phone)) {
        return res.status(400).json({ success: false, error: "Phone must be a valid number with 10-15 digits" });
      }
      if (website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(website)) {
        return res.status(400).json({ success: false, error: "Invalid website URL" });
      }

      const result = await contactMethodsRepository.updateContactMethod(id, { phone, email, website });
      res.status(200).json({ success: true, message: "Contact method updated successfully", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to update contact method" });
    }
  },

  deleteContactMethod: async (req, res) => {
    try {
      const { id } = req.params;
      await contactMethodsRepository.deleteContactMethod(id);
      res.status(200).json({ success: true, message: "Contact method deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to delete contact method" });
    }
  }
};

module.exports = { contactMethodsController };
