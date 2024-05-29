const { ROLES } = require("../enum");

module.exports = {
  async up(db, client) {
    //write your migration here.
    const role = await db.collection('roles').findOne({ role: ROLES.ADMIN });
    console.log(role)
    const admin = {
    name : "meet vaghani",
    email : "meetvaghani711@gmail.com",
    password : "$2a$10$VBAAEZrnHChZEL4XwMdBkutP3od7/JPnZbLGNgIZTkNI/RTmcUTri",
    role : role._id,
    _v:0
    }
    await db.collection('authors').insertOne(admin);
  },

  async down(db, client) {
    
    await db.collection('authors').updateOne({email: 'meetvaghani711@gmail.com'}, {$set: {isDeleted: false}});
  }
};
