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
    var result = await User.find().populate('following','firstname lastname profileimg Rating').populate('followers','firstname lastname profileimg Rating').populate('purchesedorder','description postimages city').populate('posts').populate('comments').populate('watchlater','title description postimages city');
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
    Rating : 5,
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
    var result = await User.findById(req.params.id).populate('following','firstname lastname profileimg Rating').populate('followers','firstname lastname profileimg Rating').populate('purchesedorder','description postimages city').populate('posts').populate('comments').populate('watchlater','title description postimages city');
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


   /////////////
  // Messages //
  /////////////


   /* create new message . */
router.post('/:id',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  var Headertoken = req.headers.authorization.split(' ')[1]
var decoded = jwt.verify(Headertoken, 'secret')
 try{ 

  var user = await User.findById(decoded.id)

  var allmsg = await Message.find({user1:"bawdw",user2:"snfbdjfb"})

  
 const newMessage = {
      user1:decoded.id,
       user2: req.params.id,
       msg: req.body.msg
}

  var resultMessage =  await Message.find(req.params.id)


 
    Message.create(newMessage)
 
}catch(error){
    res.json({err:error})
}
            
    
});




module.exports = router;
