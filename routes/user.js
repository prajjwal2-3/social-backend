const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User,Post}= require("../db");
const {default:mongoose}=require("mongoose");


router.post('/signup', (req, res) => {
    const {username,password,information} = req.body
       User.create({
        username,
        password,
        information
       })
       res.json({
               username:username,
               password:password
       })
});
router.get('/login',userMiddleware,(req,res)=>{
    const {username,password} = req.headers
    res.json({
        username:username,
        password:password,
        msg:'login successful'
    })
}


)

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