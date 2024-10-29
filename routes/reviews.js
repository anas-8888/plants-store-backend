const express = require("express");
const { reviewsController } = require("./../controllers/reviews.controller");
const { isCustomer } = require("../middleware/isCustomer");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.post("/createReview", isAdmin, reviewsController.createReview);
router.get("/findAllReviews", reviewsController.findAllReviews);
router.get("/findReviewById/:id", reviewsController.findReviewById);
router.delete("/deleteReview/:id", isAdmin, reviewsController.deleteReview);
router.put("/updateReview/:id", isAdmin, reviewsController.updateReview);

module.exports = router;
