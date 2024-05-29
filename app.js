require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const database = require('./config/database')
const author = require('./routes/author')
const book = require('./routes/book')
const APIError = require('./utils/APIError')


database()
const app = express()
const port = process.env.PORT
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.use('/author', author)
app.use('/book' , book)
app.use(function (err, req, res, next) {
    // Check if the error is an instance of APIError
    if (err instanceof APIError) {
      const errorMessage = err.message.replace(/"/g, "");
      return res.status(err.status).json({ error: errorMessage });
    } else {
      // Handle other types of errors
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error'});
    }
  });
app.listen(port, () => console.log(`server running on  ${port}!`))