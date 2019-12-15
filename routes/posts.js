var express = require('express');
var router = express.Router();
const {Post} = require('../model/post')
const {Comment} = require('../model/post')
const jwt = require('jsonwebtoken');

process.env.SECRET_KEY = 'secret'

   ////////////
  //  Post  //
  ////////////

/* GET all posts . */
router.get('/', async(req, res, next) =>{
  try {
    var result = await Post.find().populate('comments');
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
      var result = await Post.findById(req.params.id).populate('comments');
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
          Post.findByIdAndDelete(req.params.id).populate('comments')
          .then(() => res.json({msg :`the post has been deleted ` }))
          .catch(err => res.send(err))
      }
       
  
  });

   ////////////
  // Comment //
  ////////////

  /* create new comment . */
router.post('/:id/:token', async(req, res, next) =>{
   try{ 

     var resultPost =  await Post.findById(req.params.id)
       const newComment = {
        description:req.body.description
  }
  
  var decoded = jwt.verify(req.params.token, 'secret')

  if(decoded){
      Comment.create(newComment)
              //comment created 
              .then(() => (res.json({msg:'created successfully',commentInf:newComment})))
              
              .catch(err =>res.send(err))

              var com = await Comment.findOne({}, {}, { sort: { 'created_at' : -1 } })
              
            resultPost.comments.push(com._id)
              
            resultPost.save()
             
  }}catch(error){
      res.send(error)
  }
              
      
  });

    /* edit comment . */
router.put('/:Postid/:Commentid/:token', function(req, res, next) {

    
    comment = {
        description:req.body.description
    }

    var decoded = jwt.verify(req.params.token, 'secret')
      
    if(decoded){
         Comment.findByIdAndUpdate(req.params.Commentid,comment)
       .then(() => res.json({msg :`the comment has been updated ` }))
       .catch(err => res.send(err))
    }
   
  
  });

    /* Delete one comment . */
router.delete('/:Postid/:Commentid/:token', function(req, res, next) {

    var decoded = jwt.verify(req.params.token, 'secret')
      if(decoded){
        Comment.findByIdAndDelete(req.params.Commentid)
          .then(() => res.json({msg :`the comment has been deleted ` }))
          .catch(err => res.send(err))
      }
       
  
  });

  



module.exports = router;