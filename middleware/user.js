const {User} = require("../db")

function userMiddleware(req, res, next) {
    const {username,password} = req.headers;
     User.findOne(
        {username: username,password:password},
     ).then(function(value){
        if(value){
            next();
        }else{
            res.status(403).json({
                msg: "User doesnt exist"
            })
        }
     })
}

module.exports = userMiddleware;