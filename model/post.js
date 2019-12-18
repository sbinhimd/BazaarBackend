const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema  = new Schema({
    
    description:{
        required: false , 
        type: String
    },
    user:{
        required: true , 
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    username:{
        type:String,
        required:true
    },
    post:{
        required: true , 
        type:Schema.Types.ObjectId,
        ref:'Post'
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
    quantity:{
        required: true , 
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
    }],
    buyer:[{ 
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    user:{
        required: true , 
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    username:{
        required: true , 
        type: String
    },
    views:{
        type: Number,
        default:0
    }

}, {timestamps: true}
);

const Post = mongoose.model('Post',postSchema)
exports.Post = Post
exports.Comment = Comment