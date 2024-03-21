const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://prajjwalbh25:AtZMTaWRJWT6uRl1@cluster0.rbysjio.mongodb.net/blog');


// const AdminSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    // profile: String,
    information: String,
    Post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const PostSchema = new mongoose.Schema({
  
    description: String,
   
    id: Number
});

// const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports = {
    // Admin,
    User,
    Post
}