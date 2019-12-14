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
    following:{
        default: [],
        type: Array
    },
    followers:{
        default: [],
        type: Array
    },
    purchesedorder:{
        default: [],
        type: Array
    },
    posts:{
        default: [],
        type: Array
    }

}, {timestamps: true}
);

const User = mongoose.model('User',userSchema)
module.exports = User