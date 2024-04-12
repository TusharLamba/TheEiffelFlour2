const validator = require("../helper/validator");

const productValidator = async (req, res, next) => {

  const validationRule = {
    "*.name": "required|string",
    "*.descr": "required|string",
    "*.max_qty": "integer",
    "*.available": "boolean",
    "*.size": "required|digits_between:2,4",
    "*.category": "required|string|size:2",
    "*.price": "required|numeric"
  };

  try {
    await validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          data: err
        });
      } else {
        next();
      }
    })
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { productValidator };