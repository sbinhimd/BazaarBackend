const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema  = new Schema({
    
    description:{
        required: false , 
        type: String
    },


}, {timestamps: true}
);

const Comment = mongoose.model('Comment',commentSchema)
module.exports = Comment