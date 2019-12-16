var express = require('express');
var router = express.Router();
const {Post} = require('../model/post')
const {Comment} = require('../model/post')
const User = require('../model/user')
const jwt = require('jsonwebtoken');

process.env.SECRET_KEY = 'secret'

   ////////////
  //  Post  //
  ////////////

/* GET all posts . */
router.get('/', async(req, res, next) =>{
  try {
    var result = await Post.find().populate('comments').populate('buyer','firstname lastname profileimg city Rating');
    res.send({result});
} catch (error) {
    res.send({error})
}
});

/* create new post . */
router.post('/:token', async(req, res, next) =>{
    const newPost = {
        title : req.body.title ,
        description:req.body.description,
        postimages:req.body.postimages,
        price:req.body.price,
         startingbid:req.body.startingbid,
        city:req.body.city, 
        isapproved:false,
        isopen:false,
        quantity:req.body.quantity,
  }
  
  var decoded = jwt.verify(req.params.token, 'secret')

  if(decoded){

    try {
        await Post.create(newPost, async(err, comment)=>{
        
            var com = comment._id
    
            var myuserid = decoded.user._id
             var myuser = await User.findById(myuserid)
             
              myuser.posts.push(com)
              myuser.save()
              
             res.json({msg: 'created successfully',postInf:newPost})
             
            })
             
             
    } catch (error) {
        res.json(error)
    }
      
  }
              
      
  });

  /* GET one post . */
router.get('/:id', async(req, res, next) =>{
    try {
      var result = await Post.findById(req.params.id).populate('comments').populate('buyer','firstname lastname profileimg city Rating');
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

  /* Delete one post and its comments . */
router.delete('/:id/:token', async(req, res, next)=> {
try {
    var decoded = jwt.verify(req.params.token, 'secret')
    if(decoded){
       await Post.findByIdAndDelete(req.params.id).populate('comments')
   

        Comment.deleteMany({ post:req.params.id }).then(next)
        res.json({msg :`the post has been deleted `})
    } 
} catch (error) {
    res.json({error :error})
}
    
       
  
  });

  
  /* Buy post (order) . */
router.post('/:id/buy/:token', async(req, res, next) =>{
   
  var decoded = jwt.verify(req.params.token, 'secret')

  if(decoded){
     
           orderId = req.params.id
           myUserId = decoded.user._id

           var order = await Post.findById(orderId)
           if(order.quantity>0){
            //decrese order quantity
            order.quantity = order.quantity-1
            order.buyer.push(myUserId)
            order.save()

            //add order to user
            var myUser = await User.findById(myUserId)
            myUser.purchesedorder.push(order._id)
            myUser.save()
            
           res.json({msg:"buy order regesterd"})
           }else{
            res.json({msg:"item is Sold out!"})
           }


  }
              
      
  });


/* watch post later  . */
  router.post('/:id/watchlater/:token', async(req, res, next) =>{
   try {
    var decoded = jwt.verify(req.params.token, 'secret')
  
    if(decoded){
       
             postId = req.params.id
             myUserId = decoded.user._id
  
             var watchlater = await Post.findById(postId)
  
              //add post to user watch later 
              var myUser = await User.findById(myUserId)
              myUser.watchlater.push(watchlater._id)
              myUser.save()
              
             res.json({msg:"post added to watch later"})

    }
   } catch (error) {
       res.json({error:error})
   }
    
    
    });



   ////////////
  // Comment //
  ////////////

  /* create new comment . */
router.post('/:id/:token', async(req, res, next) =>{

var decoded = jwt.verify(req.params.token, 'secret')
   try{ 

     var resultPost =  await Post.findById(req.params.id)
       const newComment = {
        description:req.body.description,
         user: decoded.user._id  ,
         post: req.params.id
  }
  
  

  if(decoded){
      await Comment.create(newComment, async(err, comment)=>{
        
        var com = comment._id

        var myuser = await User.findById(decoded.user._id)
              
              
        resultPost.comments.push(com)
        resultPost.save()

        myuser.comments.push(com)
        myuser.save()

        res.json({msg:'created successfully',commentInf:newComment})
         
        })
      
      
             

             
  }}catch(error){
      res.json({err:error})
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