//Import catch async error
const CatchAsyncError = require('./catchAsyncError');

//Import Error handler 
const ErrorHandler = require('../utils/errorHandler');

//Import JWT lib 
const jwt = require('jsonwebtoken');

//Import account reppository
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');


exports.checkGroup = async (username, ...groups)=>{

    //Get user by id
    const returnUser = await AccountRepository.getAccountByUsername(username);
    if(returnUser[0]){
        //Get all groups by the account username
        const userAllGroups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);
        //group validation
        for(const k in userAllGroups){
            if(groups.includes(userAllGroups[k].groupName)){
                return true;
            }
        }
        return false;
    }
};