const joi = require('joi')
const APIError = require('../utils/APIError')

const validateBook = (  req  , res , next)=>{
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
  })

  const validation = payload.validate(req.body)
  if(validation.error) {
    throw new  APIError(validation.error.message , 422)
  }
  next()

}

const validateBookUpdate = ( req , res , next) =>{
   const payload = joi.object({
    name: joi
    .string()
    .regex(/^[A-Za-z\s]+$/)
    .min(3)
    .optional()
    .messages({
      "string.min": "Name must be at least 3 characters long",
      "string.pattern.base": "Name must be valid",
    }),

    author: joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
        'string.pattern.base': 'User ID must be a valid ObjectId',
        'any.required': 'User ID is required',
    })
   })

   const  validation = payload.validate(req.body)
   if(validation.error) {
    throw new  APIError(validation.error.message , 422)
   }
   next()
}

 module.exports = {  validateBook , validateBookUpdate  }