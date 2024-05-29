const { ROLES } = require("../enum");


module.exports = {
  async up(db, client) {
    const role = [
      {
        role: ROLES.ADMIN,
        _v: 0,
      },
      {
        role: ROLES.USER,
        _v: 0
      }
    ]
    await db.collection('roles').insertMany(role)
  },

  async down(db, client) {
    //  write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
