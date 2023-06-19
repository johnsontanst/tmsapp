//Import Repository 
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');

//Import entities
const User = require('../entity/user_model');

//Import JWT
const {generateJWT} = require('../utils/jwtUtils');

//Import catch Async error & error handler
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/catchAsyncError');

//Import validation
const {userValidation} = require('../utils/userValidation');
const {passwordEncryption, passwordValidation} = require('../utils/passwordUtils');

//POST : create new account || URL : /register
exports.newAccountC = CatchAsyncError( async (req, res, next)=>{
    //Regex password & email
    const passRegex = /(?=.*?[\w])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}/
    const emailRegex = /^\S+@\S+\.\S+$/
    const usernameRegex = /[a-zA-Z]+[0-9]*/

    //Check the request has all the fields and validate
    if(!usernameRegex.test(req.body.username) || !passRegex.test(req.body.password) || !emailRegex.test(req.body.email) ){
        return res.status(500).json({
            success:false,
            message:"Unable to register"
        });
    }
    else{
        const user = await AccountRepository.newAccount(req.body.username, await passwordEncryption(req.body.password), req.body.email);

        if(user){
            req.session.testing = 2;
            return res.status(200).json({
                success:true,
                cookie: req.session.testing
            })
        }
        else{
            return res.status(500).json({
                success:false,
                message:"Unable to register"
            });
        }
    }

});

//POST : login by username || URL : /login 
exports.loginC = CatchAsyncError( async(req,res,next)=>{
    //get account by username and return http error 403 if username is not found
    const returnUser = await AccountRepository.getAccountByUsername(req.body.username);
    if(returnUser[0] === undefined){
        return res.status(403).json({
            success:false,
            message:"Invalid creds"
        });
    }

    //password validation
    if(await passwordValidation(req.body.password, returnUser[0].password)){
        const token = await generateJWT(returnUser[0].id);
        req.session.authToken = token;
        return res.status(200).send({
            success:true,
            message:"Login success",
            token
        });
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Invalid password"
        });
    }
});

//POST : create group || URL : /register/group
exports.newGroupC = CatchAsyncError(async (req,res,next)=>{
    //Check for group name
    if(req.body.groupName){
        try{
            const result = await GroupRepository.newGroup(req.body.groupName);
            if(result){
                res.status(201).send({
                    status:true,
                    message:"Group created"
                })
            }
        }catch(err){
            return res.status(500).send({
                success:false,
                message:"Fail to create group"
            });
        }
    }
    else{
        return next(new ErrorHandler("Error creating group", 500));
    }
});

//POST : add user into group || URL : /add/usertogroup
exports.addUserToGroupC = CatchAsyncError(async (req, res, next)=>{
    //validate account id and group id
    const returnUser = await AccountRepository.getAccountByEmail(req.body.email);
    const returnGroup = await GroupRepository.getGroupByGroupName(req.body.groupName);
    console.log(returnGroup);
    if(returnUser[0], returnGroup[0]){
        try{
            const result = GroupRepository.addAccountToGroup(returnUser[0].id, returnGroup[0].id);
            return res.status(201).send({
                success:true,
                message:"user added into group"
            });
        }
        catch(err){
            return next(new ErrorHandler("Error in adding user into group", 500));
        }
    }
});


exports.temprotected = async (req,res,next)=>{
    const result = await GroupRepository.getAllAccountsByGroupId(req.body.accGroupId);
    console.log(result);
    return res.status(200).send({
        temp : req.session.authToken,
        allCookie : req.session
    });
};

