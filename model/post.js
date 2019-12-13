const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema  = new Schema({
    
    title : {
        required : true , 
        type: String
    },
    description:{
        default: "",
        required: false , 
        type: String
    },
    postimages:{
        required: false , 
        type: String
    },
    price:{
        required: Number , 
        type: String
    },
     startingbid:{
        required: Number , 
        type: String
    },
    city:{
        default: "",
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