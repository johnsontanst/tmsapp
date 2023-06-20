//Import JWT token
const jwt = require('jsonwebtoken')

exports.generateJWT = async (username)=>{
    if(username){
        return jwt.sign({id:username}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE_IN});
    }
    else{
        return false;
    }
}

