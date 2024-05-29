const mongoose = require("mongoose");
const BOOK = require("../model/book");
const AUTHOR = require("../model/author");
const APIError = require("../utils/APIError");
const { ROLES } = require("../enum");

class BookService {
  async addBook(name, user ) {
    try {
      const query = { name: name, isDeleted: false };
      const book = await BOOK.findOne(query);

      if (book) {
        throw new APIError("book already exists", 400);
      }
      console.log(user)
      const author = await AUTHOR.findOne({ _id: user, isDeleted: false });

      if (!author) throw new APIError("author not found", 404);

      //create new book
      const newBook = new BOOK({
        name: name,
        author: user.toString(),
      });

      await newBook.save();

      // Add the book ID to the 'books' field in the Author model.
      author.books.push(newBook._id);
      await author.save();
      return newBook;
    } catch (error) {
      throw error;
    }
  }

  async getBook(id) {
    try {
      const objectId = mongoose.Types.ObjectId.createFromHexString(id);
      const query = { _id: objectId, isDeleted: false };

      // Aggregate query
      const book = await BOOK.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            name: 1,
            _id: 1,
            author: "$author.name",
          },
        },
      ]);

      if (!book.length) {
        throw new APIError("Book not found", 404);
      }

      return book;
    } catch (error) {
      throw error;
    }
  }

  async getAllBook() {
    try {
      const query = { isDeleted: false };

      // Aggregate query with projection
      const allBooks = await BOOK.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            name: 1,
            _id: 1,
            author: "$author.name",
          },
        },
      ]);

      if (!allBooks.length) {
        throw new APIError("Book not found", 404);
      }

      return allBooks;
    } catch (error) {
      throw error;
    }
  }

  async updateBook(id, payload, user, role) {
    try {
      const book = await BOOK.findOne({ _id: id, isDeleted: false });
      if (!book) {
        throw new APIError("Book not found", 404);
      }

      // Clone of the payload to prevent any modifications to the original payload.
      const updateFields = { ...payload };
      if (updateFields.author) {
        const author = await AUTHOR.findOne({ _id: id, isDeleted: false });
        if (!author) throw new APIError("Author not found", 404);
      }

      // Allow update if book author is current user or Admin
      if (user.equals(book.author._id) || role.includes(ROLES.ADMIN)) {
        const updateBook = await BOOK.findByIdAndUpdate(
          book._id,
          updateFields,
          { new: true }
        );
        return updateBook;
      }

      throw new APIError("You are not allowed to update this book", 403);
    } catch (error) {
      throw error;
    }
  }

  async deleteBook(id, role) {
    try {
      const query = { _id: id, isDeleted: false };
      const book = await BOOK.findOne(query);
      if (!book) {
        throw new APIError("Book not found", 404);
      }

      // Allow if current user is admin
      if (role.includes(ROLES.ADMIN)) {
        const deleteBook = await BOOK.findByIdAndUpdate(
          book._id,
          { isDeleted: 1 },
          { new: true }
        );
        if (!deleteBook) {
          throw new APIError("Error While Delete Book", 500);
        }
        return "book deleted  Success Fully";
      }

      throw new APIError("You are not allowed to delete this book", 403);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookService();
