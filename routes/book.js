
const router = require('express').Router()
const { addBook  , getBook , getAllBook , updateBook, deleteBook} = require('../controller/book')
const { ROLES } = require('../enum')
const { authorization } = require('../middleware/authentication')
const { validateBook, validateBookUpdate } = require('../validation/book')
const { validateParamsId } = require('../validation/params')

router.get('/getBook/:id',authorization([ROLES.USER , ROLES.ADMIN]) ,validateParamsId ,getBook )
router.get('/allBook' ,  authorization([ROLES.USER , ROLES.ADMIN]), getAllBook )
router.post('/addBook', authorization([ROLES.USER , ROLES.ADMIN]) ,validateBook , addBook)
router.put('/updateBook/:id' ,authorization([ROLES.USER , ROLES.ADMIN]), validateParamsId ,validateBookUpdate ,updateBook )
router.delete('/deleteBook/:id' , authorization([ROLES.ADMIN]) , validateParamsId , deleteBook)




module.exports = router


