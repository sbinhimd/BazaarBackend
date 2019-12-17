const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema  = new Schema({
    user1:{
        required : true , 
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    user2:{
        required : true , 
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    msg:{ 
        required:true,
        type:Array,
        timestamps: true
    }
}
);

const Message = mongoose.model('Message',messageSchema)
module.exports = Message