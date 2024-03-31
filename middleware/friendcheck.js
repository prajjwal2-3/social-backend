const {User} = require("../db")

function checkMiddleware(req, res, next) {
    const {username,password,userid} = req.headers;
     User.findOne(
        {username: username,password:password},
     ).then(function(value){
        const have = value.Pendingrequest.includes(userid)
        const friend = value.Friends.includes(userid)
        const have2 = value.Sentrequest.includes(userid)
        if(have || friend || have2){
            res.json({
                msg: "Already sent"
            })
           
        }else{
            next();
        }
     })
}

module.exports = checkMiddleware;