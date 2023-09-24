const mongoose = require('mongoose');
const user = require('./User');
const {Schema} = mongoose;

const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'    
    },
    title:{
        type: String,
        required: true
        
    },
    description:{
        type: String,
        required: true
        
    },
    tag:{
        type: String,
        default: 'general'
        
    },
    date:{
        type: Date,
        default: Date.now

    }
   

    

});
 Notes= mongoose.model('notes' , NotesSchema)
 module.exports = Notes