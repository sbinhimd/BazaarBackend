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
    username2: {
        required : true , 
        type:String
    },
    msg:[{ 
        from:String,
        content:String
    }]
}
);

const Message = mongoose.model('Message',messageSchema)
module.exports = Message