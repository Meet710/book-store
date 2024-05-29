const router =  require('express').Router()
const { get } = require('mongoose')
const { authorRegister ,authorLogin , getAllAuthors} = require('../controller/author')
const { validateAuthor, validateAuthorLogin } = require('../validation/author')
const { authorization } = require('../middleware/authentication')
const { ROLES } = require('../enum')

router.get('/allAuthor' ,authorization([ ROLES.ADMIN , ROLES.USER]) , getAllAuthors )
router.post('/register', validateAuthor , authorRegister )
router.post('/login' , validateAuthorLogin , authorLogin)

module.exports = router