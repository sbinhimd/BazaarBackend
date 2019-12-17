const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');

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
        type: Text
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
    }],
    msg:[{
        type:Schema.Types.ObjectId,
        ref:'Message'
    }]
}, {timestamps: true}
);

userSchema.methods.verifyPassword = (plainPassword, hashedPassword, cb) => {

    bcrypt.compare(plainPassword, hashedPassword, (err, response) => {
      if(err) { 
        return cb(err) 
      }
      return cb(null, response)
    })
   }

const User = mongoose.model('User',userSchema)
module.exports = User