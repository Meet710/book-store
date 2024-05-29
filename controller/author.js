const AuthorService = require('../service/author.service')

exports.authorRegister = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const newAuthor = await AuthorService.registerAuthor({ name, email, password });
      res.status(200).json(newAuthor);
    } catch (error) {
      next(error);
    }
  };

  exports.authorLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { author, token } = await AuthorService.loginAuthor({ email, password });
      res.status(200).json({ data: author, token });
    } catch (error) {
      next(error);
    }
  };
  
  exports.getAllAuthors = async (req, res, next) => {
    try {
      const authors = await AuthorService.getAllAuthors();
      res.status(200).json(authors);
    } catch (error) {
      next(error);
    }
  };

 