var express = require('express');
var router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

process.env.SECRET_KEY = 'secret'

/* GET all users . */
router.get('/', async(req, res, next) =>{
  try {
    var result = await User.find();
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
        res.send(`email used !!! change the email`)
    }

}).catch(err => res.send(err))
});

/* GET one user . */
router.get('/:id', async(req, res, next) =>{
  try {
    var result = await User.findById(req.params.id);
    res.send({result});
} catch (error) {
    res.send({error})
}
});

/* edit user . */
router.put('/edit/:token', function(req, res, next) {
  res.send('respond with a resource');
});

/* Delete one user . */
router.delete('/:token', function(req, res, next) {
  var decoded = jwt.verify(req.params.token, 'secret')
    
     User.findByIdAndDelete(decoded.user._id)
        .then(() => res.json({msg :`the user has been deleted ` }))
        .catch(err => res.send(err))

});

/* login user . */
router.post('/login' , (req , res)=>{
  User.findOne({email: req.body.email})
  .then(user =>{
      if(user){
          if( bcrypt.compareSync(req.body.password , user.password)){
              user.password = " " //to show empty String in token
              var payload = {user} // to make the the password Hashed 
              let token = jwt.sign(payload , process.env.SECRET_KEY , {expiresIn: 1440})
              res.json({token: token})
          }

          //if password is NOT the same 
          else{
              res.json({error: "Password is NOT correct"}).status(401)
          }
      }
      else{
          res.send("email is NOT found").status(201)
      }
  }).catch(err => res.send(err))
})



module.exports = router;