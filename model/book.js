const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId

const BookSchema = new Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, ref: 'author', required: true },
    isDeleted : { type: Boolean, enum : [ true, false] , default: false }
})

module.exports =  mongoose.model('book', BookSchema)
