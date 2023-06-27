//Import catch async error
const CatchAsyncError = require('./catchAsyncError');

//Import Error handler 
const ErrorHandler = require('../utils/errorHandler');

//Import JWT lib 
const jwt = require('jsonwebtoken');

//Import account reppository
const AccountRepository = require('../repository/accountRepository');


exports.loginAuthentication = CatchAsyncError(async (req,res,next)=>{
    let token = req.cookies.authToken;
    let sToken = req.session.authToken;

    //1 check
    if(token != sToken){
        return next(new ErrorHandler("Not authenticated", 403));
    }


    if(token){
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        //2 check : check user ip
        const currentUserIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(decoded.userip != currentUserIp || !currentUserIp){
            return next(new ErrorHandler("Not authenticated", 403));
        }

        //3 check : check user agent
        const currentUserAgent = req.headers['user-agent'];
        if(decoded.useragent != currentUserAgent){
            return next(new ErrorHandler("Not authenticated", 403));
        }

        //Get user by id
        const returnUser = await AccountRepository.getAccountByUsername(decoded.username);
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