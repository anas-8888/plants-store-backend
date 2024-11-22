const {
      createHelpSupport,
      getAllHelpSupport,
      getHelpSupportById,
      updateHelpSupport,
      deleteHelpSupport,
    } = require("../repositories/helpSupport.repository");
    
    const validateHelpSupportInput = (data) => {
      const errors = {};
      if (!data.title_AR) errors.title_AR = "Arabic title is required.";
      if (!data.title_EN) errors.title_EN = "English title is required.";
      if (!data.description_AR) errors.description_AR = "Arabic description is required.";
      if (!data.description_EN) errors.description_EN = "English description is required.";
      return errors;
    };
    
    const helpSupportController = {
      // Create Help and Support entry
      async createHelpSupport(req, res) {
        const { title_AR, title_EN, description_AR, description_EN } = req.body;
        const errors = validateHelpSupportInput({ title_AR, title_EN, description_AR, description_EN });
    
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }
    
        try {
          await createHelpSupport({ title_AR, title_EN, description_AR, description_EN });
          return res.status(201).json({ message: "Help and Support entry created successfully" });
        } catch (error) {
          return res.status(500).json({ error: "Failed to create Help and Support entry", details: error.message });
        }
      },
    
      // Get all Help and Support entries
      async getAllHelpSupport(req, res) {
        try {
          const entries = await getAllHelpSupport();
    
          const responseEntries = entries.map(entry => ({
            id: entry.id,
            title: req.language === "ar" ? entry.title_AR : entry.title_EN,
            description: req.language === "ar" ? entry.description_AR : entry.description_EN,
          }));
    
          return res.status(200).json(responseEntries);
        } catch (error) {
          return res.status(500).json({ error: "Failed to retrieve Help and Support entries", details: error.message });
        }
      },
    
      // Get Help and Support entry by ID
      async getHelpSupportById(req, res) {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({ error: "Help and Support ID is required" });
        }
    
        try {
          const entry = await getHelpSupportById(id);
    
          if (!entry) {
            return res.status(404).json({ error: "Help and Support entry not found" });
          }
    
          const responseEntry = {
            id: entry.id,
            title: req.language === "ar" ? entry.title_AR : entry.title_EN,
            description: req.language === "ar" ? entry.description_AR : entry.description_EN,
          };
    
          return res.status(200).json(responseEntry);
        } catch (error) {
          return res.status(500).json({ error: "Failed to retrieve Help and Support entry", details: error.message });
        }
      },
    
      // Update Help and Support entry
      async updateHelpSupport(req, res) {
        const { id } = req.params;
        const { title_AR, title_EN, description_AR, description_EN } = req.body;
    
        if (!id) {
          return res.status(400).json({ error: "Help and Support ID is required" });
        }
    
        if (!title_AR && !title_EN && !description_AR && !description_EN) {
          return res.status(400).json({ error: "Nothing to update!" });
        }
    
        try {
          const existingEntry = await getHelpSupportById(id);
    
          if (!existingEntry) {
            return res.status(404).json({ error: "Help and Support entry not found" });
          }
    
          const updatedContent = {
            title_AR: title_AR || existingEntry.title_AR,
            title_EN: title_EN || existingEntry.title_EN,
            description_AR: description_AR || existingEntry.description_AR,
            description_EN: description_EN || existingEntry.description_EN,
          };
    
          await updateHelpSupport(id, updatedContent);
          return res.status(200).json({ message: "Help and Support entry updated successfully" });
        } catch (error) {
          return res.status(500).json({ error: "Failed to update Help and Support entry", details: error.message });
        }
      },
    
      // Delete Help and Support entry
      async deleteHelpSupport(req, res) {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({ error: "Help and Support ID is required" });
        }
    
        try {
          const existingEntry = await getHelpSupportById(id);
    
          if (!existingEntry) {
            return res.status(404).json({ error: "Help and Support entry not found" });
          }
    
          await deleteHelpSupport(id);
          return res.status(200).json({ message: "Help and Support entry deleted successfully" });
        } catch (error) {
          return res.status(500).json({ error: "Failed to delete Help and Support entry", details: error.message });
        }
      },
    };
    
    module.exports = { helpSupportController };
    