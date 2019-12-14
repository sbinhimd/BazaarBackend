const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema  = new Schema({
    
    description:{
        required: false , 
        type: String
    }
}, {timestamps: true}
);

const Comment = mongoose.model('Comment',commentSchema)





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
        default: [],
        required: false , 
        type: Array
    },
    price:{
        required: false , 
        type: Number
    },
     startingbid:{
        required: false , 
        type: Number
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
    },
    comments:[{ 
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]

}, {timestamps: true}
);

const Post = mongoose.model('Post',postSchema)
exports.Post = Post
exports.Comment = Comment