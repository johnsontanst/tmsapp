//Import JWT token
const jwt = require('jsonwebtoken')

exports.generateJWT = async (accountId)=>{
    if(accountId){
        return jwt.sign({id:accountId}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE_IN});
    }
    else{
        return false;
    }
}

