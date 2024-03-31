const {User} = require("../db")

function checkMiddleware(req, res, next) {
    const {username,password,userid} = req.headers;
     User.findOne(
        {username: username,password:password},
     ).then(function(value){
        const have = value.Pendingrequest.includes(userid)
        const friend = value.Friends.includes(userid)
        if(have || friend){
            res.status(403).json({
                msg: "Already sent"
            })
           
        }else{
            next();
        }
     })
}

module.exports = checkMiddleware;