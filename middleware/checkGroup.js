//Import catch async error
const CatchAsyncError = require('./catchAsyncError');

//Import Error handler 
const ErrorHandler = require('../utils/errorHandler');

//Import JWT lib 
const jwt = require('jsonwebtoken');

//Import account reppository
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');


exports.checkGroup = (...groups)=>{
    return async (req,res,next)=>{
        let token = req.body.authTokenC;

        if(token){
            const c = jwt.verify(token, process.env.SECRET_KEY);

            //Get user by id
            const returnUser = await AccountRepository.getAccountByUsername(c.username);
            if(returnUser[0]){
                //Get all groups by the account username
                const userAllGroups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);
                //group validation
                for(const k in userAllGroups){
                    if(groups.includes(userAllGroups[k].groupName)){
                        return next();
                    }
                }
                return next(new ErrorHandler("Not authorized", 403));
            }
        }
        else{
            return next(new ErrorHandler("Not authorized", 403));
        }
    }
};