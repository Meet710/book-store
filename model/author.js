const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Types.ObjectId;

const AuthorSchema = new Schema({
  name: { type: String, minlength: 3, required: true },
  email:{ type : String ,  minlength: 3,  unique: true , required: true },
  books: [{ type: ObjectID, ref: 'book' }],
  password: { type: String, minlength: 6, required: true },
  role: [{ type: ObjectID, ref: "role", required: true }],
  isDeleted: { type: Boolean, enum: [true, false], default: false },
});

AuthorSchema.pre("save", function save(next) {
  try {
    //call this  function when password is Modified not other field 
    if(!this.isModified('password')) return next()

    this.password = bcrypt.hashSync(this.password, 10);
    return next();
  } catch (error) {
    console.log(error);
  }
});


module.exports = mongoose.model('author', AuthorSchema)
