var express = require('express');
var router = express.Router();
const User = require('../model/user')
const Message = require('../model/message')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');


process.env.SECRET_KEY = 'secret'

/* GET all users . */
router.get('/' ,passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  try {
    var result = await User.find().populate('following','firstname lastname profileimg Rating').populate('followers','firstname lastname profileimg Rating').populate('purchesedorder','description postimages city').populate('posts').populate('comments').populate('watchlater','title description postimages city').populate('msg');
    res.send({result});
} catch (error) {
    res.send({error})
}
});

/* create new user . */
router.post('/', function(req, res, next) {
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email : req.body.email,
    password : req.body.password,
    description : req.body.description,
    profileimg : req.body.profileimg ,
    phonenumber : req.body.phonenumber,
    username : req.body.username,
    city : req.body.city,
    isadmin: false,
    isverified: false

}

User.findOne({email: req.body.email})
.then(user =>{

    if(!user){

        bcrypt.hash(req.body.password , 10 ,(err, hash)=>{
            newUser.password = hash
            User.create(newUser)
            //user created 
            .then(user => res.json({msg: 'created successfully',userInf:newUser}))
            .catch(err =>res.send(err))
        })
    }else{
        res.json({msg:`email used !!! change the email`})
    }

}).catch(err => res.send(err))
});

/* GET one user . */
router.get('/:id' ,passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  try {
    var result = await User.findById(req.params.id).populate('following','firstname lastname username profileimg Rating').populate('followers','firstname lastname username profileimg Rating').populate('purchesedorder','description postimages city').populate('posts').populate('comments').populate('watchlater','title description postimages city').populate('msg');
    res.send({result});
} catch (error) {
    res.send({error})
}
});

/* edit user . */
router.put('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {

  user = {
  "firstname": req.body.firstname,
  "lastname": req.body.lastname,
  "description" : req.body.description,
  "profileimg" : req.body.profileimg ,
  "city" : req.body.city
}
var Headertoken = req.headers.authorization.split(' ')[1]
  var decoded = jwt.verify(Headertoken, 'secret')

if (decoded.id == req.params.id ||decoded.isadmin == true ) {
    User.findByIdAndUpdate(decoded.id,user)
     .then(() => res.json({msg :`the user has been updated ` }))
     .catch(err => res.send(err))
}else{
    res.json({msg :`You must be the same user or the admin to update ` })
}
      
  
    
  

});

/* Delete one user . */
router.delete('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var Headertoken = req.headers.authorization.split(' ')[1]
  var decoded = jwt.verify(Headertoken, 'secret')

    if (decoded.isadmin == true) {
        User.findByIdAndDelete(req.params.id)
        .then(() => res.json({msg :`the user has been deleted ` }))
        .catch(err => res.send(err))
    } else {
        res.json({msg :`only admin can delete ` })
    }
     

});


/* follow user . */
router.post('/:followid',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
    try {
        var Headertoken = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(Headertoken, 'secret')
        if (decoded) {
           var myUserId = decoded.id
           var followid = req.params.followid

            //add to myUser following
          var myUser = await User.findById(myUserId)
            myUser.following.push(followid)
            myUser.save()

           //add to user followers
           var user = await User.findById(followid)
           user.followers.push(myUserId)
           user.save()

            res.json({msg:"follow Done"});

        }

      
  } catch (error) {
     
      res.json({error})
  }
  });

  /* Rate user . */
router.post('/:id/rate',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{

  try {
      var Headertoken = req.headers.authorization.split(' ')[1]
      var decoded = jwt.verify(Headertoken, 'secret')
if (req.body.star != null && req.body.review != null ) {

  if (decoded.id != req.params.id) {

    var otherUserid = req.params.id

var otheruser = await User.findById(otherUserid)
var fuser = await User.findById(decoded.id)

    ratingObj={
     username:fuser.username,
     userid:fuser._id,
     star:req.body.star,
     review:req.body.review
    }

    //add rating to otheruser
    otheruser.Rating.push(ratingObj)
    otheruser.save()

     res.json({msg:"follow Done"});

 }
} else {
  res.json({msg:"you have to pass star and review"});
}
     

    
} catch (error) {
   
    res.json({error})
}
});

  /* change password . */
  router.post('/:id/changepassword',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{

    try {
        var Headertoken = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(Headertoken, 'secret')

  if (req.body.newpassword != null && req.body.password != null) {
  
    if (decoded.id == req.params.id || decoded.isadmin == true) {
  
  

  var fuser = await User.findById(decoded.id)
  
     
//inputs
const userCurrentPassword = req.body.password
const hash = fuser.password
const userNewPassword = req.body.newpassword



 //confirm password
bcrypt.compare(userCurrentPassword, hash, function(err, isMatch) {
  if (err) {
    throw err
  } else if (!isMatch) {
    res.json({"msg":"Password doesn't match!"})
  } else {

    //hashing new password
    const saltRounds = 10
 
bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    throw err
  } else {
    bcrypt.hash(userNewPassword, salt, function(err, hash) {
      if (err) {
        throw err
      } else {
        fuser.password = hash
        fuser.save()
        res.json({"msg":"Password changed"})
      }
    })
  }
})


  }
})
  
  
   }else{
    res.json({msg:"not Authorized"});
   }
  } else {
    res.json({msg:"you have to pass new and old password !"});
  }
       
  
      
  } catch (error) {
     
      res.json({error})
  }
  });


    /* change isverified  . */
    router.post('/:id/isverified',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
      try {
       var Headertoken = req.headers.authorization.split(' ')[1]
       var decoded = jwt.verify(Headertoken, 'secret')
        userId = req.params.id
        var userToChange = await User.findById(userId)
     
       if(decoded.isadmin ==true ){

            userToChange.isverified = !(userToChange.isverified)
            userToChange.save()
  
                res.json({msg:"isverified status changed"})
   
       }else{
        res.json({msg:"not Authorized"})
       }
      } catch (error) {
          res.json({error:error})
      }
       
       
       });






   /////////////
  // Messages //
  /////////////


   /* create new message . */
router.post('/send/:id',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  var Headertoken = req.headers.authorization.split(' ')[1]
var decoded = jwt.verify(Headertoken, 'secret')
var user1 = await User.findById(decoded.id)
var user2 = await User.findById(req.params.id)

 try{ 

  

   const newMessage = {
      user1:decoded.id,
       user2: req.params.id,
       username2: user2.username,
       msg: {from:decoded.id,content:req.body.msg}
}

  var allmsg = await Message.findOne().and([{user1:decoded.id,user2:req.params.id}])
  var allmsg1 = await Message.findOne().and([{user1:req.params.id,user2:decoded.id}])

  if (allmsg != null) {
    allmsg.msg.push(newMessage.msg) 
     
    if (allmsg.save()) {
      res.json({msg: 'msg sent'})
    }else{
      res.json({msg: 'msg error'})
    }
     
  } else if(allmsg1!= null){
    allmsg1.msg.push(newMessage.msg)
    if (allmsg1.save()) {
      res.json({msg: 'msg sent'})
    }else{
      res.json({msg: 'msg error'})
    }

  }else {

   await Message.create(newMessage, async(err, message)=>{
        
   try {
    var com = message._id

    user1.msg.push(com)
    user2.msg.push(com)

    if (user1.save() && user2.save() ) {
      res.json({msg: 'msg sent'})
    }else{
      res.json({msg: 'msg error'})
    }
   } catch (error) {
    res.json({error: error})
   }
   
    
    })
  
  
  }
}catch(error){
    res.json({err:error})
}
            
    
});

/* GET all message . */
router.get('/allmsg' ,passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  try {
    var result = await Message.find();
    console.log("result",result);
    
    res.json({result});
} catch (error) {
    res.send({error})
}
});





module.exports = router;
