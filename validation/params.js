const joi = require('joi')
const APIError = require('../utils/APIError')

const validateParamsId = ( req , res , next) => {
   const params =  joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'ID must be a valid ObjectId',
            'any.required': 'ID parameter is required',
        })
    
    const validate = params.validate(req.params.id)
    if (validate.error) {
        throw new APIError(validate.error.message, 422)
    }
    next()

}
module.exports = { validateParamsId }