const { body } = require("express-validator");

exports.forgotValidation = [
  body("emailorphone")
    .notEmpty().withMessage("Email or phone is required")
    .custom((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error("Enter a valid email or 10-digit phone number");
      }
      return true;
    }),
];

