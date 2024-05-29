const joi = require("joi");
const APIError = require("../utils/APIError");


const validateAuthor = (req, res, next) => {
  const payload = joi.object({
    name: joi
      .string()
      .regex(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.min": "Name must be at least 3 characters long",
        "string.required": "Enter Your Name",
        "string.pattern.base": "Name must be valid",
      }),

    email: joi
      .string()
      .email()
      .custom((value, helpers) => {
        if (value !== value.toLowerCase()) {
          return helpers.message("Email must be in lowercase");
        }
        return value;
      })
      .required()
      .messages({
        "string.base": "Enter a valid email address",
        "string.email": "Enter a valid email address",
        "any.required": "Enter the email",
      }),
      password: joi
      .string()
      .pattern(/^[A-Za-z0-9]{3,30}$/)
      .required()
      .messages({
        "string.pattern.base": "Enter Valid password",
        "any.required": `Enter the password`,
      }),

  });

  const validation = payload.validate(req.body)
  if(validation.error) {
    throw new  APIError(validation.error.message , 422)
  }
  next()
};


const  validateAuthorLogin = (req, res , next)=>{
    const payload = joi.object({
        email: joi
        .string()
        .email()
        .custom((value, helpers) => {
          if (value !== value.toLowerCase()) {
            return helpers.message("Email must be in lowercase");
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Enter a valid email address",
          "string.email": "Enter a valid email address",
          "any.required": "Enter the email",
        }),
        password: joi
        .string()
        .pattern(/^[A-Za-z0-9]{3,30}$/)
        .required()
        .messages({
          "string.pattern.base": "Enter Valid password",
          "any.required": `Enter the password`,
        })

    })
    const  validation = payload.validate(req.body)
    if(validation.error) {
        throw new  APIError(validation.error.message , 422)
    }
    next()
}

module.exports = { validateAuthor , validateAuthorLogin }