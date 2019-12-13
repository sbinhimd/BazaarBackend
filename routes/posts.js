var express = require('express');
var router = express.Router();
const Post = require('../model/post')
const jwt = require('jsonwebtoken');

process.env.SECRET_KEY = 'secret'

/* GET all posts . */
router.get('/', async(req, res, next) =>{
  try {
    var result = await Post.find();
    res.send({result});
} catch (error) {
    res.send({error})
}
});

/* create new post . */
router.post('/:token', function(req, res, next) {
    const newPost = {
        title : req.body.title ,
        description:req.body.description,
        postimages:req.body.postimages,
        price:req.body.price,
         startingbid:req.body.startingbid,
        city:req.body.city, 
        isapproved:false,
        isopen:false
  }
  
  var decoded = jwt.verify(req.params.token, 'secret')

  if(decoded){
      Post.create(newPost)
              //post created 
              .then(() => res.json({msg: 'created successfully',postInf:newPost}))
              .catch(err =>res.send(err))
  }
              
      
  });

  /* GET one post . */
router.get('/:id', async(req, res, next) =>{
    try {
      var result = await Post.findById(req.params.id);
      res.send({result});
  } catch (error) {
      res.send({error})
  }
  });

  /* edit post . */
router.put('/:id/:token', function(req, res, next) {

    
    post = {
        title : req.body.title ,
        description:req.body.description,
        postimages:req.body.postimages,
        price:req.body.price,
        startingbid:req.body.startingbid,
        city:req.body.city, }

    var decoded = jwt.verify(req.params.token, 'secret')
      
    if(decoded){
         Post.findByIdAndUpdate(req.params.id,post)
       .then(() => res.json({msg :`the post has been updated ` }))
       .catch(err => res.send(err))
    }
   
  
  });

  /* Delete one post . */
router.delete('/:id/:token', function(req, res, next) {

    var decoded = jwt.verify(req.params.token, 'secret')
      if(decoded){
          Post.findByIdAndDelete(req.params.id)
          .then(() => res.json({msg :`the post has been deleted ` }))
          .catch(err => res.send(err))
      }
       
  
  });



module.exports = router;