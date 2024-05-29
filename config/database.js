const mongoose =  require('mongoose')

const connectDB =   async ()=>{
    try {
        const DB_URI = process.env.DB_URI
        const connect = await mongoose.connect(DB_URI)
        if (connect) {
            console.log('Successfully connected to database')
        }
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
   
}

module.exports = connectDB