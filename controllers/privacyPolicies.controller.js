const {
      createPrivacyPolicy,
      getAllPrivacyPolicies,
      getPrivacyPolicyById,
      updatePrivacyPolicy,
      deletePrivacyPolicy,
} = require("../repositories/privacyPolicies.repository");

const validatePrivacyPolicyInput = (data) => {
      const errors = {};
      if (!data.content_AR) errors.content_AR = "Arabic content is required.";
      if (!data.content_EN) errors.content_EN = "English content is required.";
      return errors;
};

const privacyPolicyController = {
      // Create Privacy Policy
      async createPrivacyPolicy(req, res) {
            const { content_AR, content_EN } = req.body;
            const errors = validatePrivacyPolicyInput({ content_AR, content_EN });

            if (Object.keys(errors).length > 0) {
                  return res.status(400).json({ errors });
            }

            try {
                  await createPrivacyPolicy({ content_AR, content_EN });
                  return res.status(201).json({ message: "Privacy Policy created successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to create Privacy Policy", details: error.message });
            }
      },

      // Get all Privacy Policies
      async getAllPrivacyPolicies(req, res) {
            try {
                  const policies = await getAllPrivacyPolicies();

                  const responsePolicies = policies.map(policy => ({
                        id: policy.id,
                        content: req.language === "ar" ? policy.content_AR : policy.content_EN,
                  }));

                  return res.status(200).json(responsePolicies);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve Privacy Policies", details: error.message });
            }
      },

      // Get Privacy Policy by ID
      async getPrivacyPolicyById(req, res) {
            const { id } = req.params;

            if (!id) {
                  return res.status(400).json({ error: "Privacy Policy ID is required" });
            }

            try {
                  const policy = await getPrivacyPolicyById(id);

                  if (!policy) {
                        return res.status(404).json({ error: "Privacy Policy not found" });
                  }

                  const responsePolicy = {
                        id: policy.id,
                        content: req.language === "ar" ? policy.content_AR : policy.content_EN,
                  };

                  return res.status(200).json(responsePolicy);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve Privacy Policy", details: error.message });
            }
      },

      // Update Privacy Policy
      async updatePrivacyPolicy(req, res) {
            const { id } = req.params;
            const { content_AR, content_EN } = req.body;

            if (!id) {
                  return res.status(400).json({ error: "Privacy Policy ID is required" });
            }

            if (!content_AR && !content_EN) {
                  return res.status(400).json({ error: "Nothing to update!" });
            }

            try {
                  const existingPolicy = await getPrivacyPolicyById(id);

                  if (!existingPolicy) {
                        return res.status(404).json({ error: "Privacy Policy not found" });
                  }

                  const updatedContent = {
                        content_AR: content_AR || existingPolicy.content_AR,
                        content_EN: content_EN || existingPolicy.content_EN,
                  };

                  await updatePrivacyPolicy(id, updatedContent);
                  return res.status(200).json({ message: "Privacy Policy updated successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to update Privacy Policy", details: error.message });
            }
      },

      // Delete Privacy Policy
      async deletePrivacyPolicy(req, res) {
            const { id } = req.params;

            if (!id) {
                  return res.status(400).json({ error: "Privacy Policy ID is required" });
            }

            try {
                  const existingPolicy = await getPrivacyPolicyById(id);

                  if (!existingPolicy) {
                        return res.status(404).json({ error: "Privacy Policy not found" });
                  }

                  await deletePrivacyPolicy(id);
                  return res.status(200).json({ message: "Privacy Policy deleted successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to delete Privacy Policy", details: error.message });
            }
      },
};

module.exports = { privacyPolicyController };
