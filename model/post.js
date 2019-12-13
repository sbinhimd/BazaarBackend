const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema  = new Schema({
    
    title : {
        required : true , 
        type: String
    },
    description:{
        required: false , 
        type: String
    },
    postimages:{
        required: false , 
        type: String
    },
    price:{
        required: false , 
        type: String
    },
     startingbid:{
        required: false , 
        type: String
    },
    city:{
        required: false , 
        type: String
    }, 
    isapproved:{
        default: false,
        type: Boolean
    },
    isopen:{
        default: false,
        type: Boolean
    }

}, {timestamps: true}
);

const Post = mongoose.model('Post',postSchema)
module.exports = Post