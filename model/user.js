const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema  = new Schema({
    firstname:{
        default: "",
        required : false , 
        type: String
    },
    lastname:{
        default: "",
        required : false , 
        type: String
    },
    email : {
        required : true , 
        type: String,
        unique:true
    },
    password:{
        required: true , 
        type: String
    },
    description:{
        default: "",
        required: false , 
        type: String
    },
    profileimg:{
        default: "",
        required: false , 
        type: String
    },
    phonenumber:{
        required: true , 
        type: String,
        unique:true
    },
     username:{
        required: true , 
        type: String,
        unique:true
    },
    city:{
        default: "",
        required: false , 
        type: String
    },
    Rating:{
        default: 5,
        required: false , 
        type: Number
    },
    isadmin:{
        default: false,
        type: Boolean
    },
    isverified:{
        default: false,
        type: Boolean
    },
    following:[{ 
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    followers:[{ 
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    purchesedorder:[{ 
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    posts:[{ 
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    comments:[{ 
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],
    watchlater:[{ 
        type:Schema.Types.ObjectId,
        ref:'Post'
    }]
}, {timestamps: true}
);

const User = mongoose.model('User',userSchema)
module.exports = User