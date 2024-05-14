const mongoose = require('mongoose')
const dotenv = require("dotenv");

dotenv.config()
const mongoURI = process.env.MONGO_URL

const connectToMongo = async ()=>{ 
    try{
        // mongoose.set('strictQuery', false)
         mongoose.connect(mongoURI)
        // console.log('Mongo connected')

    }
    catch(error){
        // console.log("error mongoose not connected")
        // process.exit()
    }
}

module.exports = connectToMongo;





