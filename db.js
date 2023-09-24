const mongoose = require('mongoose')

const mongoURI = "mongodb://0.0.0.0:27017/notebook"

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





