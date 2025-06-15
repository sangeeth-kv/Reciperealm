const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    console.log(errorMessages)
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  next();
};

module.exports = { validate };
