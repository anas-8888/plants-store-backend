const {
      createNewSocial,
      getAllSocials,
      getSocialById,
      deleteOneSocial,
      updateOneSocial
} = require("../repositories/social.repository");

// Helper function for validating input
function validateSocialInput(data) {
      const errors = {};
      if (!data.platform_name_AR) errors.platform_name_AR = "Arabic platform name is required.";
      if (!data.platform_name_EN) errors.platform_name_EN = "English platform name is required.";
      if (!data.url) errors.url = "URL is required.";
      return errors;
}

const socialController = {
      // Create new social platform
      async createSocial(req, res) {
            const { platform_name_AR, platform_name_EN, url } = req.body;
            const errors = validateSocialInput({ platform_name_AR, platform_name_EN, url });
            if (Object.keys(errors).length > 0) {
                  return res.status(400).json({ errors });
            }

            try {
                  await createNewSocial({ platform_name_AR, platform_name_EN, url });
                  return res.status(201).json({ message: "Social platform created successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to create social platform", details: error.message });
            }
      },

      // Get all social platforms
      async findAllSocials(req, res) {
            try {
                  const socials = await getAllSocials();

                  const responseSocials = socials.map(social => ({
                        id: social.id,
                        name: req.language === "ar" ? social.platform_name_AR : social.platform_name_EN,
                        url: social.url
                  }));

                  return res.status(200).json(responseSocials);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve social platforms", details: error.message });
            }
      },

      // Get social platform by ID
      async findSocialById(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Social platform ID is required" });
            }

            try {
                  const social = await getSocialById(id);
                  if (!social) {
                        return res.status(404).json({ error: "Social platform not found" });
                  }

                  const responseSocial = {
                        id: social.id,
                        name: req.language === "ar" ? social.platform_name_AR : social.platform_name_EN,
                        url: social.url
                  };

                  return res.status(200).json(responseSocial);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve social platform", details: error.message });
            }
      },

      // Delete social platform by ID
      async deleteSocial(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Social platform ID is required" });
            }

            try {
                  const isExist = await getSocialById(id);
                  if (!isExist) {
                        return res.status(400).json({ error: "Social platform ID not found!" });
                  }

                  await deleteOneSocial(id);
                  return res.status(200).json({ message: "Social platform deleted successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to delete social platform", details: error.message });
            }
      },

      // Update social platform by ID
      async updateSocial(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Social platform ID is required" });
            }

            let { platform_name_AR, platform_name_EN, url } = req.body;
            if (!platform_name_AR && !platform_name_EN && !url) {
                  return res.status(400).json({ error: "Nothing to update!" });
            }

            try {
                  const isExist = await getSocialById(id);
                  if (!isExist) {
                        return res.status(400).json({ error: "Social platform ID not found!" });
                  }

                  platform_name_AR = platform_name_AR || isExist.platform_name_AR;
                  platform_name_EN = platform_name_EN || isExist.platform_name_EN;
                  url = url || isExist.url;

                  const errors = validateSocialInput({ platform_name_AR, platform_name_EN, url });
                  if (Object.keys(errors).length > 0) {
                        return res.status(400).json({ errors });
                  }

                  await updateOneSocial({ id, platform_name_AR, platform_name_EN, url });
                  return res.status(200).json({ message: "Social platform updated successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to update social platform", details: error.message });
            }
      },
};

module.exports = { socialController };
