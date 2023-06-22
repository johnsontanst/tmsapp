//Import Repository 
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');

//Import JWT
const {generateJWT, checkGroup} = require('../utils/jwtUtils');

//Import JWT token
const jwt = require('jsonwebtoken')

//Import catch Async error & error handler
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/catchAsyncError');

//Import validation
const {passwordEncryption, passwordValidation} = require('../utils/passwordUtils');
const catchAsyncError = require('../middleware/catchAsyncError');

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
        try{
            const user = await AccountRepository.newAccount(req.body.username, await passwordEncryption(req.body.password), req.body.email);
            if(user){
                req.session.testing = 2;
                return res.status(200).json({
                    success:true,
                    message:"User registered"
                })
            }
            else{
                return res.status(500).json({
                    success:false,
                    message:"Unable to register"
                });
            }
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Unable to register"
            });
        }
    }

});

//POST : login by username || URL : /login 
exports.loginC = CatchAsyncError( async(req,res,next)=>{
    try{
         //get account by username and return http error 403 if username is not found
        const returnUser = await AccountRepository.getAccountByUsername(req.body.username);
        if(returnUser[0] === undefined){
            return res.status(403).json({
                success:false,
                message:"Invalid creds"
            });
        }

        //Check status 
        if(!returnUser[0].status == 1){
            res.status(403).send({
                success:false,
                message:"Account suspended, please contact the admin"
            });
        }

        //password validation
        if(await passwordValidation(req.body.password, returnUser[0].password)){
            //Generate token
            const token = await generateJWT(returnUser[0].username);
            //Get group 
            const groups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);
            //Set token in session
            req.session.authToken = token

            return res.status(200).send({
                success:true,
                username: returnUser[0].username,
                group: groups[0].groupName,
                token: req.session.authToken
            });
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Invalid password"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
   
});

//POST : create group || URL : /register/group
exports.newGroupC = CatchAsyncError(async (req,res,next)=>{
    //Check for group name
    if(req.body.groupName){
        try{
            console.log("result");
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
    const returnUser = await AccountRepository.getAccountByUsername(req.body.username);
    const returnGroup = await GroupRepository.getGroupByGroupName(req.body.groupName);
    if(returnUser[0], returnGroup[0]){
        try{
            const result = GroupRepository.addAccountToGroup(returnUser[0].username, returnGroup[0].groupName);
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

//POST : Logout || URL : /logout
exports.logoutC = async(req, res,next)=>{
    //Get auth token from session cookie
    const authToken = req.session.authToken;
    console.log(authToken);
    //Logout user if auth token exisit
    if(authToken){
        //Looping through the session variables and deletes
        for(const k in req.session){
            if(k !== "cookie"){
                delete req.session[k];
            }
        }
        return res.status(200).send({
            success:true,
            message:"logout success"
        });
    }
    else{
        return res.status(500).send({
            success:false,
            message:"Fail to logout"
        });
    }
}

//POST : auth token check roles || URL : /authtoken/checkrole
exports.authTokenCheckRole = CatchAsyncError(async (req,res,next)=>{

    if(!req.body.authTokenC && !req.body.username){
        return res.status(401).send({
            success:false
        });
    }
    
    //Check if current user is authorized 
    const u = jwt.verify(req.body.authTokenC, process.env.SECRET_KEY);

    if(u.username != req.body.username){
        return res.status(403).send({
            success:false
        });
    }

    if(u){
        const isUserInGroup = await checkGroup(u.username, req.body.groupName);

        if(isUserInGroup){

            return res.status(200).send({
                success:true
            });
        }
    }

    return res.status(403).send({
        success:false
    });
});


//POST : get all users || URL : /allusers
exports.allUsersC = catchAsyncError(async(req, res, next)=>{
    //Query DB for all users
    const allUsers = await AccountRepository.getAllUsers();
    if(allUsers){
        return res.status(200).send({
            success:true,
            users: allUsers
        });
    }
    else{
        return res.status(500).send({
            success:false
        });
    }
})

//POST : user change password/email || URL : /update/user
exports.updateUser = CatchAsyncError(async (req,res,next)=>{

    try{
        //check for auth token
        if(!req.body.authTokenC && !req.body.username){
            return res.status(401).send({
                success:false
            });
        }

        const u = jwt.verify(req.body.authTokenC, process.env.SECRET_KEY);
        console.log(req.body.authTokenC);
        //Verify username
        if(u.username != req.body.username){
            return res.status(401).send({
                success:false
            });
        }

        const returnUser = await AccountRepository.getAccountByUsername(u.username);
        if(returnUser){
            //validate password
            if(req.body.oldPassword == undefined){
                return res.status(500).send({
                    success:false
                });
            }
            if(!await passwordValidation(req.body.oldPassword, returnUser[0].password)){
                return res.status(500).send({
                    success:false
                });
            }

            //Regex email n password 
            const passRegex = /(?=.*?[\w])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}/
            const emailRegex = /^\S+@\S+\.\S+$/

            //Parse in email and password with validation
            let updateEmail, updatePassword
            if(req.body.email && emailRegex.test(req.body.email)){
                updateEmail = req.body.email
            }
            else{
                return res.status(500).send({
                    success:false
                });
            }
            if(req.body.password == undefined) {
                updatePassword = returnUser[0].password;
            }
            else if(req.body.password && passRegex.test(req.body.password)){
                updatePassword = await passwordEncryption(req.body.password);
            }
            else{
                return res.status(500).send({
                    success:false
                });
            }

            //Update user
            const result = await AccountRepository.updateUserEmailPassword(updateEmail, updatePassword, u.username);
            if(result){
                return res.status(200).send({
                    success: true
                });
            }
            
        }
        return res.status(500).send({
            success: false
        }); 
    }
    catch(err){
        return res.status(500).send({
            success: false
        }); 
    }

}) 

//POST : admin change user email/password/status/group || URL : /admin/update/user
exports.adminUpdateUser = CatchAsyncError(async (req,res,next)=>{

    try{
        //retrieve the fields from req
        let email, password, status, group, username, groupArray;
        const passRegex = /(?=.*?[\w])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}/
        const emailRegex = /^\S+@\S+\.\S+$/

        if(req.body.email && emailRegex.test(req.body.email)) email = req.body.email;
        if(req.body.password && passRegex.test(req.body.password)) password = await passwordEncryption(req.body.password);
        if(req.body.status && (req.body.status != 1 || req.body.status != 0)) status = req.body.status;
        if(req.body.group) group = req.body.group;
        if(req.body.username) username = req.body.username;

        //Update user
        const updateUserResult = await AccountRepository.adminUpdateEmailPasswordStatus(email, password, username, status);
        if(!updateUserResult){
            return res.status(500).send({
                success:false,
                message:"Unable to update user"
            });
        }

        //Delete/Update group
        if(group){
            const deleteGroupResult = await GroupRepository.deleteAllGroupsByUsername(username);
            if(!deleteGroupResult){
                return res.status(500).send({
                    success:false,
                    message:"Unable to unlink user from group"
                });
            }

            //Conver group into array
            groupArray = group.split(',');
            if(groupArray){
                for(let i = 0; i < groupArray.length; i++){
                    const validGroupResult = await GroupRepository.getGroupByGroupName(groupArray[i]);
                    
                    if(validGroupResult.length == 0){
                        return res.status(500).send({
                            success:false
                        });
                    }
                    else{
                        const insertGroupResult = await GroupRepository.addAccountToGroup(username, groupArray[i]);
                    }
                }
            }
        }
        else{
            //Delete group
            const deleteGroupResult = GroupRepository.deleteAllGroupsByUsername(username);
            if(!deleteGroupResult){
                return res.status(500).send({
                    success:false,
                    message:"Unable to unlink user from group"
                });
            }
        }
        return res.status(200).send({
            success:true
        });
    }
    catch(err){
        return res.status(500).send({
            success:false,
            message:err
        });
    }
});

//POST : get user profile || URL : /profile
exports.getUserProfile = CatchAsyncError(async(req,res,next)=>{
    //decode JWT
    if(!req.body.authTokenC){
        res.status(500).send({
            success:false
        });
    }

    const decoded = jwt.verify(req.body.authTokenC, process.env.SECRET_KEY);

    if(decoded){
        //Get user 
        const returnUser = await AccountRepository.getAccountByUsername(decoded.username);
        //Get user group
        const returnGroup = await GroupRepository.getAllGroupNameByUsername(decoded.username);
        if(returnUser && returnGroup){
            res.status(200).send({
                success:true,
                username:returnUser[0].username,
                status:returnUser[0].status,
                email:returnUser[0].email
            });
        }
    }

});



exports.temprotected = async (req,res,next)=>{
    return res.status(200).send({
        success:true,
        session: req.session
    });
};

exports.welcome = async(req,res,next)=>{
    return res.status(200).send({
        success: true,
        message: "welcome"
    });
}

