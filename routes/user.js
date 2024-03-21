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



router.post('/post', userMiddleware,async (req, res) => {
    const {username} = req.headers;
   
   const {description,id}=req.body;
   Post.create({
    description:description,
    id:id
   })

   const post = await Post.find({
    id:id
   })
if(post){
    await User.updateOne({
        username:username
    },{
        $push:{
          Post:post
        }
    })
}
   res.send("post updated successfully ")
});

router.get('/userspost', userMiddleware,async (req, res) => {
    try {
        const { username } = req.headers;
        const user = await User.findOne({ username: username });
        
        if (!user) {
           return res.status(404).send("User not found");
        }
        
        const posts = await Post.find({ _id: { $in: user.Post } });
        
        res.send(posts);
     } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
     }
  
});

module.exports = router