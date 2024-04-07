const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User,Post}= require("../db");
const {default:mongoose}=require("mongoose");
const checkMiddleware = require("../middleware/friendcheck");
//signup post
//login get
//sendrequest post
//request  get
//accept request post
//get post
//add post
//user suggestions get
//user info
//users post
//

router.post('/signup', (req, res) => {
    const {username,password,information} = req.body
       User.create({
        username,
        password,
        information
       })
       res.json({
               username:username,
               password:password,
               msg:'true'
       })
});
router.get('/login',userMiddleware,(req,res)=>{
    const {username,password} = req.headers
    res.json({
        username:username,
        password:password,
        msg:'true'
    })
});



router.post('/sendrequest',userMiddleware,checkMiddleware, async (req,res)=>{
    const {username,password,userid} = req.headers
    
const user = await User.findOne({
    username:username,
    password:password
})
const senderid = user._id.valueOf();
if(user){
    //to update reciever
    await User.updateOne({
        _id:userid
    },{
        $push:{
        Pendingrequest:senderid
        }
    })
    //to update sender
    await User.updateOne({
        username:username,
        password:password
    },{
        $push:{
            Sentrequest:userid
        }
    })
    res.send('connection request sent')
    
}else{
    console.log("cant find")
    res.send('cant find')
}

}),

router.get('/friendrequest',userMiddleware,async(req,res)=>{
    const {username, password} = req.headers;
    const user = await User.findOne({
        username:username,
        password:password
    })
    res.json({
        'pending':user.Pendingrequest,
        'sent':user.Sentrequest,
        'friends': user.Friends
    })
}),

router.post('/acceptrequest', userMiddleware, async (req, res) => {
  try {
    const { username, password, userid } = req.headers;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' }); 
    }

    if (user.Pendingrequest.length === 0) {
      return res.send('No pending requests to accept'); 
    }
     const user_id = user._id.valueOf();
    try {
      await User.updateOne({ _id: user._id }, { $pull: { Pendingrequest:userid },$push:{Friends:userid} });
      await User.updateOne({ _id:userid},{ $pull:{Sentrequest:user_id},$push:{Friends:user_id}})
      const updatedUser = await User.findOne({ username, password }); 
      res.send("Friend request accepted");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error 1' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error 2' }); 
  }
});





router.get('/post',async (req, res) => {
    const Postlist = await Post.find({})
    res.json({
        Post: Postlist
    })
}
    )
router.get('/usersuggestion',async(req,res)=>{
    const users = await User.find({})
    res.json({
        user:users
    })
})
router.get('/userinfo', async(req,res)=>{
    const {userid} = req.headers
    const userdata = await User.findOne({
        _id:userid
    })
    res.send(userdata)
})


router.post('/post', userMiddleware,async (req, res) => {
    const {username,password} = req.headers;
   const userid = await User.findOne({
    username:username,
    password:password
   })
  
   const {description}=req.body;
 await Post.create({
    description:description,
    user_id:userid._id
   })

   const post = await Post.find({
    user_id:userid._id
   })
  
if(post){
    await User.updateOne({
        _id:userid._id
    },{
        $push:{
          Post:post
        }
    })
    
}else{
    console.log("cant find")
}
   res.send("post updated successfully ")
});

router.get('/userspost', userMiddleware,async (req, res) => {
    try {
        const { username,password } = req.headers;
        const user = await User.findOne({ username: username, password:password });
        
        if (!user) {
           return res.status(404).send("User not found");
        }else{
            const posts = await Post.find({ user_id:user._id });
            res.send(posts);
        }
        
       
        
        
     } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
     }
  
});

module.exports = router