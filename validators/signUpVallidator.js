
const { body } = require("express-validator");

exports.signupValidation = [
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required"),

  body("email")
    .isEmail()
    .withMessage("Email must be valid "),

  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits"),

  body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character, one uppercase letter and least 6 characters"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("ConfirmPassword do not match");
      }
      return true;
    }),
];

