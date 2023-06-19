//Import catch async error
const CatchAsyncError = require('./catchAsyncError');

//Import Error handler 
const ErrorHandler = require('../utils/errorHandler');

//Import JWT lib 
const jwt = require('jsonwebtoken');

//Import account reppository
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');

//Import user validation
const {userValidation} = require('../utils/userValidation');


exports.checkGroup = (...groups)=>{
    return async (req,res,next)=>{
        let token = req.session.authToken;

        if(token){
            const decoded_id = jwt.verify(token, process.env.SECRET_KEY);

            //Get user by id
            const returnUser = await AccountRepository.getAccountById(decoded_id.id);
            if(returnUser[0]){
                //Get all groups by the account id
                const userAllGroups = await GroupRepository.getAllGroupNameByAccountId(returnUser[0].id);
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