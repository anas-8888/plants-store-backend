const {
      createNewReview,
      getAllReviews,
      getReviewById,
      deleteOneReview,
      updateOneReview
} = require("../repositories/reviews.repository.js");

// Helper function for validating input
function validateReviewInput(data) {
      const errors = {};
      if (!data.customer_name_AR) errors.customer_name_AR = "Arabic customer name is required.";
      if (!data.customer_name_EN) errors.customer_name_EN = "English customer name is required.";
      if (!data.message_AR) errors.message_AR = "Arabic message is required.";
      if (!data.message_EN) errors.message_EN = "English message is required.";
      if (data.rate == null) errors.rate = "Rate is required.";
      return errors;
}

const reviewsController = {
      // Create new review
      async createReview(req, res) {
            const { customer_name_AR, customer_name_EN, message_AR, message_EN, rate } = req.body;
            const errors = validateReviewInput({ customer_name_AR, customer_name_EN, message_AR, message_EN, rate });
            if (Object.keys(errors).length > 0) {
                  return res.status(400).json({ errors });
            }

            try {
                  await createNewReview({ customer_name_AR, customer_name_EN, message_AR, message_EN, rate });
                  return res.status(201).json({ message: "Review created successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to create review", details: error.message });
            }
      },

      // Get all reviews
      async findAllReviews(req, res) {
            try {
                  const reviews = await getAllReviews();

                  const responseReviews = reviews.map(review => ({
                        id: review.id,
                        customer_name: req.language === "ar" ? review.customer_name_AR : review.customer_name_EN,
                        message: req.language === "ar" ? review.message_AR : review.message_EN,
                        rate: review.rate
                  }));

                  return res.status(200).json(responseReviews);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve reviews", details: error.message });
            }
      },

      // Get review by ID
      async findReviewById(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Review ID is required" });
            }

            try {
                  const review = await getReviewById(id);
                  if (!review) {
                        return res.status(404).json({ error: "Review not found" });
                  }

                  const responseReview = {
                        id: review.id,
                        customer_name: req.language === "ar" ? review.customer_name_AR : review.customer_name_EN,
                        message: req.language === "ar" ? review.message_AR : review.message_EN,
                        rate: review.rate
                  };

                  return res.status(200).json(responseReview);
            } catch (error) {
                  return res.status(500).json({ error: "Failed to retrieve review", details: error.message });
            }
      },

      // Delete review by ID
      async deleteReview(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Review ID is required" });
            }

            try {
                  const isExist = await getReviewById(id);
                  if (!isExist) {
                        return res.status(400).json({ error: "Review ID not found!" });
                  }

                  await deleteOneReview(id);
                  return res.status(200).json({ message: "Review deleted successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to delete review", details: error.message });
            }
      },

      // Update review by ID
      async updateReview(req, res) {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({ error: "Review ID is required" });
            }

            let { customer_name_AR, customer_name_EN, message_AR, message_EN, rate } = req.body;
            if (!customer_name_AR && !customer_name_EN && !message_AR && !message_EN && !rate) {
                  return res.status(400).json({ error: "Nothing to update!" });
            }

            try {
                  const isExist = await getReviewById(id);
                  if (!isExist) {
                        return res.status(400).json({ error: "Review ID not found!" });
                  }

                  customer_name_AR = customer_name_AR || isExist.customer_name_AR;
                  customer_name_EN = customer_name_EN || isExist.customer_name_EN;
                  message_AR = message_AR || isExist.message_AR;
                  message_EN = message_EN || isExist.message_EN;
                  rate = rate != null ? rate : isExist.rate;

                  const errors = validateReviewInput({ customer_name_AR, customer_name_EN, message_AR, message_EN, rate });
                  if (Object.keys(errors).length > 0) {
                        return res.status(400).json({ errors });
                  }

                  await updateOneReview({ id, customer_name_AR, customer_name_EN, message_AR, message_EN, rate });
                  return res.status(200).json({ message: "Review updated successfully" });
            } catch (error) {
                  return res.status(500).json({ error: "Failed to update review", details: error.message });
            }
      },
};

module.exports = { reviewsController };
