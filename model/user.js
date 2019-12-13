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
        type: String
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
        type: String
    },
     username:{
        required: true , 
        type: String
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
    }

}, {timestamps: true}
);

const User = mongoose.model('User',userSchema)
module.exports = User