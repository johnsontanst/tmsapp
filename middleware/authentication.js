//Import catch async error
const CatchAsyncError = require('./catchAsyncError');

//Import Error handler 
const ErrorHandler = require('../utils/errorHandler');

//Import JWT lib 
const jwt = require('jsonwebtoken');

//Import account reppository
const AccountRepository = require('../repository/accountRepository');

//Import user validation
const {userValidation} = require('../utils/userValidation');


exports.loginAuthentication = CatchAsyncError(async (req,res,next)=>{
    let token = req.session.authToken;

    if(token){
        const decoded_id = jwt.verify(token, process.env.SECRET_KEY);

        //Get user by id
        const returnUser = await AccountRepository.getAccountById(decoded_id.id);
        if(returnUser[0]){
            req.session.user = {
                "username" : returnUser[0].username,
                "email" : returnUser[0].email
            }
            return next();
        }
    }
    else{
        return next(new ErrorHandler("Not authenticated", 403));
    }
});