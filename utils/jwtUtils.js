//Import JWT token
const jwt = require('jsonwebtoken')

//Import Repository 
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');

exports.generateJWT = async (username, userIp, userAgent)=>{
    if(username){
        return jwt.sign({username:username, userip:userIp, useragent:userAgent}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE_IN});
    }
    else{
        return false;
    }
}

exports.checkGroup = async(userid, groupName)=>{
    //Get user by id
    const returnUser = await AccountRepository.getAccountByUsername(userid);
    if(returnUser[0]){
        //Get all groups by the account username
        const userAllGroups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);
        //group validation
        for(const k in userAllGroups){
            if(groupName.includes(userAllGroups[k].groupName)){
                return true;
            }
        }
    }
    return false;
}

