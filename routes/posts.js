var express = require('express');
var router = express.Router();
const {Post} = require('../model/post')
const {Comment} = require('../model/post')
const User = require('../model/user')
const jwt = require('jsonwebtoken');

const passport = require('passport');

process.env.SECRET_KEY = 'secret'

// var Headertoken = req.headers.authorization.split(' ')[1]

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
router.post('/',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{

    var Headertoken = req.headers.authorization.split(' ')[1]
  var decoded = jwt.verify(Headertoken, 'secret')

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
        user: decoded.id,
        username: decoded.username,
        views:req.body.views
  }
  

  if(decoded){

    try {
        await Post.create(newPost, async(err, comment)=>{
        
            var com = comment._id
    
            var myuserid = decoded.id
            
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

      result.views = result.views + 1
      result.save()
      res.send({result});
  } catch (error) {
      res.send({error})
  }
  });

   /* Bid post (order) . */
router.post('/:id/bid',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
  try {
      var Headertoken = req.headers.authorization.split(' ')[1]
      var decoded = jwt.verify(Headertoken, 'secret')
       orderId = req.params.id
       myUserId = decoded.id

    var order = await Post.findById(orderId)

      if(decoded.id == order.user){
         
               bid = {
                userid:myUserId,
                username:decoded.username,
                value:req.body.value
               }
            var currentbid = order.bids[order.bids.length-1].value
               
               
               if(order.quantity>0 && req.body.value != null ){
                   
                //decrese order quantity
                // order.quantity = order.quantity-1
              
                if (req.body.value>currentbid) {
                   order.bids.push(bid)
                await order.save()
  
                
               res.json({msg:"bid regesterd"})
                } else {
                  res.json({msg:"value must be greater than current bid"})
                }
                
               }else{
                res.json({msg:"item is Sold out!"})
               }
    
    
      }else{
        res.json({msg:"you cant bid on your post ! or you have to pass value as number"})
      } 
  } catch (error) {
      res.json({error:error})
  }
  
            
    
});

  /* edit post . */
router.put('/:id',passport.authenticate('jwt', {session: false}), async(req, res, next) => {
 var Headertoken = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(Headertoken, 'secret')
    var findpost = await Post.findById(req.params.id)

    if (decoded.isadmin ==true) {
      post = req.body
      Post.findByIdAndUpdate(req.params.id,post)
      .then(() => res.json({msg :`the post has been updated ` }))
      .catch(err => res.send(err))
    } else if(decoded.id == findpost.user) {
      post = {
        title : req.body.title ,
        description:req.body.description,
        postimages:req.body.postimages,
        price:req.body.price,
        startingbid:req.body.startingbid,
        city:req.body.city,
        quantity:req.body.quantity
     }

      Post.findByIdAndUpdate(req.params.id,post)
      .then(() => res.json({msg :`the post has been updated ` }))
      .catch(err => res.send(err))
    }else{
      res.json({msg :`Unauthorized ` } )
    }


  });

  /* Delete one post and its comments . */
router.delete('/:id',passport.authenticate('jwt', {session: false}), async(req, res, next)=> {

try {
    var Headertoken = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(Headertoken, 'secret')
    
    if(decoded.isadmin == true){
       await Post.findByIdAndDelete(req.params.id).populate('comments')
        Comment.deleteMany({ post:req.params.id }).then(next)
        res.json({msg :`the post has been deleted `})
    }else{
        res.json({msg :`only admin can delete `})
    }
} catch (error) {
    res.json({error :error})
}
    
       
  
  });

  
  /* Buy post (order) . */
router.post('/:id/buy',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
    try {
        var Headertoken = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(Headertoken, 'secret')
      
        if(decoded){
           
                 orderId = req.params.id
                 myUserId = decoded.id
                 
                 
                 var order = await Post.findById(orderId)
                 if(order.quantity>0){
                     
                  //decrese order quantity
                  order.quantity = order.quantity-1
                  order.buyer.push(myUserId)
                 await order.save()
      
                  //add order to user
                  var myUser = await User.findById(myUserId)
                  myUser.purchesedorder.push(order._id)
                  await myUser.save()
                  
                 res.json({msg:"buy order regesterd"})
                 }else{
                  res.json({msg:"item is Sold out!"})
                 }
      
      
        } 
    } catch (error) {
        res.json({error:error})
    }
    
              
      
  });


/* watch post later  . */
  router.post('/:id/watchlater',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
   try {
    var Headertoken = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(Headertoken, 'secret')
  
    if(decoded){
       
             postId = req.params.id
             myUserId = decoded.id
  
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

  /* change isopen  . */
  router.post('/:id/isopen',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
    try {
     var Headertoken = req.headers.authorization.split(' ')[1]
     var decoded = jwt.verify(Headertoken, 'secret')
      var postToChange = await Post.findById(postId)
   
     if(decoded.isadmin ==true ||postToChange.user == decoded.id ){
        
              postId = req.params.id
   
             
          postToChange.isopen = !(postToChange.isopen)
          postToChange.save()

              res.json({msg:"isopen status changed"})
 
     }else{
      res.json({msg:"not Authorized"})
     }
    } catch (error) {
        res.json({error:error})
    }
     
     
     });

     /* change isapproved  . */
  router.post('/:id/isapproved',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
    try {
     var Headertoken = req.headers.authorization.split(' ')[1]
     var decoded = jwt.verify(Headertoken, 'secret')
   
     if(decoded.isadmin ==true){
        
              postId = req.params.id
   
              var postToChange = await Post.findById(postId)
          postToChange.isapproved = !(postToChange.isapproved)
          postToChange.save()

              res.json({msg:"isapproved status changed"})
 
     }else{
      res.json({msg:"not Authorized"})
     }
    } catch (error) {
        res.json({error:error})
    }
     
     
     });




   ////////////
  // Comment //
  ////////////

  /* create new comment . */
router.post('/:id',passport.authenticate('jwt', {session: false}), async(req, res, next) =>{
    var Headertoken = req.headers.authorization.split(' ')[1]
var decoded = jwt.verify(Headertoken, 'secret')


   try{ 

     var resultPost =  await Post.findById(req.params.id)
       const newComment = {
        description:req.body.description,
         user: decoded.id  ,
         username: decoded.username,
         post: req.params.id
  }
  
  if(decoded){
      await Comment.create(newComment, async(err, comment)=>{
        
        var com = comment._id

        var myuser = await User.findById(decoded.id)
              
              
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
router.put('/:Postid/:Commentid',passport.authenticate('jwt', {session: false}), async(req, res, next)=> {

    
    comment = {
        description:req.body.description
    }

    var Headertoken = req.headers.authorization.split(' ')[1]

    var decoded = jwt.verify(Headertoken, 'secret')
    var findcomment = await Comment.findById(req.params.Commentid)
    if(decoded.id == findcomment.user || decoded.isadmin ==true ){
         Comment.findByIdAndUpdate(req.params.Commentid,comment)
       .then(() => res.json({msg :`the comment has been updated ` }))
       .catch(err => res.send(err))
    }else{
        res.json({msg :`Only admin can edit ` })
    }
   
  
  });

    /* Delete one comment . */
router.delete('/:Postid/:Commentid',passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var Headertoken = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(Headertoken, 'secret')

      if(decoded.isadmin == true){
        Comment.findByIdAndDelete(req.params.Commentid)
          .then(() => res.json({msg :`the comment has been deleted ` }))
          .catch(err => res.send(err))
      }else{
        res.json({msg :`only admin can delete` })
      }
       
  
  });

  



module.exports = router;