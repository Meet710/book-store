const BookService = require("../service/book.service");

exports.addBook = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user)
    const { name } = req.body;

    const newBook = await BookService.addBook(name, user);
    res.status(200).json(newBook);
  } catch (error) {
    next(error);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await BookService.getBook(id);
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

exports.getAllBook = async (req, res, next) => {
  try {
    const books = await BookService.getAllBook();
    res.status(200).json(books);
  } catch (error) {
    next(error)
  }
};

exports.updateBook = async ( req , res , next)=>{
  try {
    const id = req.params.id
    const payload = req.body
    const user = req.user
    const role = req.role

    const updateRecord = await BookService.updateBook(id ,payload , user , role)
    res.status(200).json(updateRecord)
  } catch (error) {
    next(error)
  }
}

exports.deleteBook = async ( req , res , next)=>{
  try {
    const id = req.params.id
    const role = req.role 

    const deleteRecord = await BookService.deleteBook(id , role)
    res.status(200).json(deleteRecord)
  } catch (error) {
    next(error)
  }
}
