
const { body } = require("express-validator");

exports.resetPasswordValidation = [

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

