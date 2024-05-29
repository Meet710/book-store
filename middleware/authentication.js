require('dotenv').config()
const jwt =  require('jsonwebtoken')
const APIError = require('../utils/APIError')
const AUTHOR = require('../model/author')

/**
 * Middleware function to handle authorization based on user roles.
 *
 * @param {string[]} roles - Array of roles that are allowed to access the resource.
 * @returns {Function} Express middleware function.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @desc Middleware function for handling authorization based on user roles.
 */

exports.authorization = (roles = []) => async (req, res, next) => {
    try {
        if (!roles.length) {
            throw new APIError('Provide Access Role', 400)
       }
   
       const authToken  =  req.headers['authorization'] //Authorization Bearer Token
       if (!authToken){
            throw new APIError('Provide Authorization Token', 400)
       }
       
       //Splitting the authorization token to extract the token value
       const token = authToken.split(' ')[1]

       //Verify Token 
       const decoded = jwt.verify(token, process.env.JWT_SECRET)
   
       if(!decoded) {
           throw new APIError('Invalid Token', 401)
       }
       //find author
       const  author = await AUTHOR.findOne({_id : decoded._id , isDeleted:false}).populate({path:'role' , model:'role', select : 'role'})
       console.log(author)
       if (!author) {
           throw new APIError('author not found' , 400)
       }
       
       // role array  and check role  Allowed  or  not
       const authorRole = author.role.map(roleObj => roleObj.role);
       const hasRequiredRole = roles.some(role => authorRole.includes(role))
      
       if(hasRequiredRole) {
         req.user = author._id,
         req.role = authorRole
          return next()
       }

       else {
        throw new APIError('Unauthorized Access', 401)
       }

    } catch (error) {
        next(error)
    }
}