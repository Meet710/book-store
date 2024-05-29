const AUTHOR = require("../model/author");
const ROLE = require("../model/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../enum");
const APIError = require("../utils/APIError");


class AuthorService {
  /**
   * Check if an author with the given email exists.
   * @param {string} email - The email of the author.
   * @returns {Promise<Object|null>} The author document if found, otherwise null.
   */

  async checkAuthorExists(email) {
    const query = { email: email, isDeleted: false };
    return await AUTHOR.findOne(query);
  }

  /**
   * Find the user role.
   * @returns {Promise<Object|null>} The role document if found, otherwise null.
   */

  async findUserRole() {
    return await ROLE.findOne({ role: ROLES.USER });
  }

  /**
   * Create a new author.
   * @param {Object} params - The parameters for creating a new author.
   * @param {string} params.name - The name of the author.
   * @param {string} params.email - The email of the author.
   * @param {string} params.password - The password of the author.
   * @param {Object} params.role - The role object of the author.
   * @returns {Promise<Object>} The newly created author document.
   * @throws {APIError} If author already exists or role not found.
   */

  async createNewAuthor({ name, email, password, role }) {
    const newAuthor = new AUTHOR({
      name,
      email,
      password,
      role: role._id,
    });
    await newAuthor.save();
    return newAuthor;
  }

  /**
   * Register a new author.
   * @param {Object} params - The parameters for registering a new author.
   * @param {string} params.name - The name of the author.
   * @param {string} params.email - The email of the author.
   * @param {string} params.password - The password of the author.
   * @returns {Promise<Object>} The newly registered author document.
   * @throws {APIError} If author already registered or role not found.
   */

  async registerAuthor({ name, email, password }) {
    const authorExist = await this.checkAuthorExists(email);
    if (authorExist) {
      throw new APIError("Author Already registered", 400);
    }

    const role = await this.findUserRole();
    if (!role) {
      throw new APIError("Role not found", 404);
    }

    return await this.createNewAuthor({ name, email, password, role });
  }

  /**
   * Login an author.
   * @param {Object} params - The parameters for author login.
   * @param {string} params.email - The email of the author.
   * @param {string} params.password - The password of the author.
   * @returns {Promise<Object>} The author document and authentication token.
   * @throws {APIError} If author not found or password is incorrect.
   */

  async loginAuthor({ email, password }) {
    const query = { email, isDeleted: false };
    const author = await AUTHOR.findOne(query);
    if (!author) {
      throw new APIError("Author not found", 404);
    }

    const verifyPassword = bcrypt.compareSync(password, author.password);
    if (!verifyPassword) {
      throw new APIError("Password is incorrect", 400);
    }

    const token = jwt.sign({ _id: author._id }, process.env.JWT_SECRET);
    return { author, token };
  }

  /**
   * Get all authors.
   * @returns {Promise<Array>} Array of author documents.
   * @throws {APIError} If no authors found.
   */


  async getAllAuthors() {
    const query = { isDeleted: false };
    const allAuthors = await AUTHOR.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "books",
        },
      },
      { $unwind: "$books" },
      {
        $project: {
          name: 1,
          _id: 1,
          "books.name": 1,
        },
      },
    ]);

    if (!allAuthors.length) {
      throw new APIError("Author not found", 404);
    }

    const authors = [];
    //organize author with  multiple  book 

    allAuthors.forEach((author) => {
      const existingAuthorIndex = authors.findIndex((item) =>
        item._id.equals(author._id)
      );

    
      if (existingAuthorIndex !== -1) {
        authors[existingAuthorIndex].books.push(author.books.name);
      } else {
        authors.push({
          _id: author._id,
          name: author.name,
          books: [author.books.name],
        });
      }
    });

    return authors;
  }
}

module.exports = new AuthorService();
