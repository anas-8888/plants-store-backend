const { body, validationResult } = require("express-validator");

const validateMessage = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional().isMobilePhone().withMessage("Phone number is invalid"),
  body("message").notEmpty().withMessage("Message cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateMessage };
