//Import env variables
const dotenv = require('dotenv');
const ErrorHandler = require('../utils/ErrorHandler');
dotenv.config({path: './config/config.env'}); 

module.exports = (err, req, res, next)=>{
    //Define the error code 
    err.statusCode = err.statusCode || 500;

    //If nodejs run in development mode then execute it
    //Development env display the err stack for debuggin
    if(process.env.NODE_ENV === 'development'){
        res.status(err.statusCode).json({
            success:false,
            error: err,
            errMessage: err.errMessage,
            stack: err.stack
        });
    }

    if(process.env.NODE_ENV === 'production'){
        //define the error in another variable 
        let error = {...err};

        error.message = err.message;

        //Handling Wrong JWT token
        if(err.name === 'JsonWebTokenError'){
            error = ErrorHandler("Json token is invalid", 500);
        };

        //Handling Expired JWT token
        if(err.name === 'TokenExpiredError'){
            error = new ErrorHandler("Json Web token expired", 500);
        }

        res.status(err.statusCode).json({
            success:false,
            message: error.message || 'Internal Server Error.'
        });
    }
}