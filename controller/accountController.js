//Import Repository 
const AccountRepository = require('../repository/accountRepository');
const GroupRepository = require('../repository/groupRepository');

//Import JWT
const {generateJWT} = require('../utils/jwtUtils');

//Import JWT token
const jwt = require('jsonwebtoken')

//Import catch Async error & error handler
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/catchAsyncError');

//Import validation
const {passwordEncryption, passwordValidation} = require('../utils/passwordUtils');
const catchAsyncError = require('../middleware/catchAsyncError');

//Import Checkgroup
const {checkGroup} = require('../middleware/checkGroup');

//POST : create new account || URL : /register || Checkgroup
exports.newAccountC = CatchAsyncError( async (req, res, next)=>{
    //CheckGroup
    if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }

    //Regex password & email
    const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|\\:;"'<>,.?/~]).{8,10}$/
    const emailRegex = /^\S+@\S+\.\S+$/
    const usernameRegex = /^[a-zA-Z0-9]+$/

    //Check the request has all the fields and validate
    if(!usernameRegex.test(req.body.username)){
        return res.status(500).json({
            success:false,
            message:"Invalid username input"
        });
    }
    else if(!passRegex.test(req.body.password)){
        return res.status(500).json({
            success:false,
            message:"Invalid password input"
        });
    }
    else if(req.body.email && !emailRegex.test(req.body.email)){
        return res.status(500).json({
            success:false,
            message:"Invalid email input"
        });
    }
    else{
        try{
            //Insert account based on email 
            if(req.body.email){
                const user = await AccountRepository.newAccount(req.body.username, await passwordEncryption(req.body.password), req.body.email);
                if(user){
                    //Link user to groups
                    if(req.body.groups.length != 0){
                        for(const k in req.body.groups){
                            //Check if group exist 
                            const checkValidGroup = await GroupRepository.getGroupByGroupName(req.body.groups[k]);
                            if(checkValidGroup){
                                //Link user to group if group is valid 
                                const res = await GroupRepository.addAccountToGroup(req.body.username, req.body.groups[k]);
                            }
                            else{
                                return res.status(403).json({
                                    success:false,
                                    message:"Error in adding user into group"
                                })
                            }
                        }
                    }
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
                //END USER CREATION
            }
            else{
                const user = await AccountRepository.newAccountWithoutEmail(req.body.username, await passwordEncryption(req.body.password));
                if(user){
                    //Link user to groups
                    if(req.body.groups.length != 0){
                        for(const k in req.body.groups){
                            //Check if group exist 
                            const checkValidGroup = await GroupRepository.getGroupByGroupName(req.body.groups[k]);
                            if(checkValidGroup){
                                //Link user to group if group is valid 
                                const res = await GroupRepository.addAccountToGroup(req.body.username, req.body.groups[k]);
                            }
                            else{
                                return res.status(403).json({
                                    success:false,
                                    message:"Error in adding user into group"
                                })
                            }
                        }
                    }
                    return res.status(200).json({
                        success:true,
                        message:"account created"
                    })
                }
                else{
                    return res.status(500).json({
                        success:false,
                        message:"Error in creating account"
                    });
                }
                //END USER CREATION
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
                message:"invalid creds"
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
            //Get user ip and user agent
            const userip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
            const useragent = req.headers['user-agent'];
            //Generate token
            const token = await generateJWT(returnUser[0].username, userip, useragent);
            //Get group 
            const groups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);
            let groupArray = []

            if(groups && groups.length >= 1){
                //Modify group array
                for (const k in groups){
                    groupArray.push(groups[k].groupName);
                }
            }

            //Set token in session
            req.session.authToken = token
            res.cookie('authToken',token, { maxAge: parseInt(process.env.COOKIE_EXPIRES_IN) * 60 * 1000, httpOnly: true, origin:"localhost:3030" });



            return res.status(200).send({
                success:true,
                username: returnUser[0].username,
                groups: groupArray,
                userip:userip,
                useragent:useragent
                
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

//POST : create group || URL : /register/group || checkgroup
exports.newGroupC = CatchAsyncError(async (req,res,next)=>{
     //CheckGroup
     if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }

    //regex for groupName
    const groupNameRegex = /^[A-Za-z0-9]+$/
    

    //Check for group name
    if(req.body.groupName && req.body.groupName != "" && groupNameRegex.test(groupNameRegex)){
        try{
            const result = await GroupRepository.newGroup(req.body.groupName);
            if(result){
                res.status(200).send({
                    success:true,
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
    
    //Looping through the session variables and deletes
    for(const k in req.session){
        if(k !== "cookie"){
            delete req.session[k];
        }
    }
    res.clearCookie("authToken");
    res.clearCookie("connect.sid");
    req.session.cookie.maxAge = 1;
    res.clearCookie("JSESSIONID");
    

    return res.status(200).send({
        success:true,
        message:"logout success"
    })

}

//POST : auth token return user info || URL : /authtoken/return/userinfo
exports.authTokenCheckRole = CatchAsyncError(async (req,res,next)=>{

    if(!req.cookies.authToken || !req.session.authToken){
        return res.status(200).send({
            success:false,
            message:"invalid token"
        });
    }
    if(req.cookies.authToken != req.session.authToken){
        return res.status(200).send({
            success:false,
            message:"invalid token"
        });
    }
    
    //Check if current user is authorized 
    const u = jwt.verify(req.cookies.authToken, process.env.SECRET_KEY);

    //Check for user string and user ip address
    const currentUserIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(u.userip != currentUserIp || !currentUserIp){
            return res.status(200).send({
                success:false,
                message:"invalid session"
            });
    }

    //check user agent
    const currentUserAgent = req.headers['user-agent'];
    if(u.useragent != currentUserAgent){
        return res.status(200).send({
            success:false,
            message:"invalid session"
        });
    }

    //Get user info and groups
    const returnUser = await AccountRepository.getAccountByUsername(u.username);
    const returnGroups = await GroupRepository.getAllGroupNameByUsername(u.username);

    if(returnUser.length >=1 && returnGroups){
        const groupArray = []
        //Modify group array
        for (const k in returnGroups){
            groupArray.push(returnGroups[k].groupName);
        }
        return res.status(200).send({
            success:true,
            username:returnUser[0].username,
            groups:groupArray
        })
    }
    else if(returnUser.length >= 1){
        return res.status(200).send({
            success:true,
            username:returnUser[0].username,
            groups:[]
        })
    }

    return res.status(403).send({
        success:false,
        message:"invalid token"
    });
});


//POST : get all users || URL : /allusers || Checkgroup
exports.allUsersC = catchAsyncError(async(req, res, next)=>{
     //CheckGroup
     if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }

    //Query DB for all users
    const allUsers = await AccountRepository.getAllUsers();
    const allGroups = await GroupRepository.getPivotGroupNusers();
    if(allUsers){
        return res.status(200).send({
            success:true,
            users: allUsers,
            groups:allGroups
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
        if(!req.cookies.authToken && !req.body.username){
            return res.status(401).send({
                success:false,
                message:"invalid token"
            });
        }

        const u = jwt.verify(req.cookies.authToken, process.env.SECRET_KEY);

        //Verify username
        if(u.username != req.body.username){
            return res.status(401).send({
                success:false,
                message:"invalid username"
            });
        }

        const returnUser = await AccountRepository.getAccountByUsername(u.username);
        if(returnUser){
            //validate password
            if(req.body.oldPassword == undefined){
                return res.status(403).send({
                    success:false,
                    message:"invalid password verification"
                });
            }
            if(!await passwordValidation(req.body.oldPassword, returnUser[0].password)){
                return res.status(403).send({
                    success:false,
                    message:"invalid password verification"
                });
            }

            //Regex email n password 
            const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|\\:;"'<>,.?/~]).{8,10}$/
            const emailRegex = /^\S+@\S+\.\S+$/

            //Parse in email and password with validation
            let updateEmail, updatePassword
            if(req.body.email == undefined || req.body.email === ""){
                updateEmail = "";
            }
            else if (req.body.email && emailRegex.test(req.body.email)){
                updateEmail = req.body.email;
            }
            else{
                return res.status(403).send({
                    success:false,
                    message:"invalid email"
                });
            }

            if(req.body.password == undefined) {
                updatePassword = returnUser[0].password;
            }
            else if(req.body.password && passRegex.test(req.body.password)){
                updatePassword = await passwordEncryption(req.body.password);
            }
            else{
                return res.status(403).send({
                    success:false,
                    message:"invalid new password"
                });
            }

            //Update user
            const result = await AccountRepository.updateUserEmailPassword(updateEmail, updatePassword, u.username);
            console.log(result);
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
            success: false,
            err:err
        }); 
    }

}) 

//POST : admin change user email/password/status/group || URL : /admin/update/user || checkgroup
exports.adminUpdateUser = CatchAsyncError(async (req,res,next)=>{
     //CheckGroup
     if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    try{
        //retrieve the fields from req
        let email, password, status, group, username, groupArray;
        const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|\\:;"'<>,.?/~]).{8,10}$/
        const emailRegex = /^\S+@\S+\.\S+$/

        //return error if email and password regex doesn't match
        if(req.body.email && !emailRegex.test(req.body.email)){
            return res.status(500).send({
                success:false,
                message:"invalid email"
            });
        }
        console.log(passRegex.test(req.body.password))
        if(req.body.password && !passRegex.test(req.body.password)){
            return res.status(500).send({
                success:false,
                message:"invalid password"
            });
        }

        //Check if email, password, status, groups and username is valid
        if(req.body.email && emailRegex.test(req.body.email)) email = req.body.email;
        if(req.body.password && passRegex.test(req.body.password)) password = await passwordEncryption(req.body.password);
        if(req.body.status && (req.body.status != 1 || req.body.status != 0)) status = req.body.status;
        if(req.body.groups) group = req.body.groups;
        if(req.body.username) username = req.body.username;

        //query the user from DB
        const returnUser = await AccountRepository.getAccountByUsername(username);
        if(returnUser.length == 0){
            res.status(500).send({
                success:false,
                message:"no user found"
            });
        }
        //Check email, password, status 
        if(!password) password = returnUser[0].password;
        if(!status) status = returnUser[0].status;
        if(!email) email = returnUser[0].email;

        //Overwrite admin status
        if(username === "admin") status = 1;

        //Update user
        const updateUserResult = await AccountRepository.adminUpdateEmailPasswordStatus(email, password, returnUser[0].username, status);
        if(!updateUserResult){
            return res.status(500).send({
                success:false,
                message:"Unable to update user"
            });
        }

        //Delete/Update group
        if(group){
            //Delete group
             //Check if current user is cookie user && if cookie current user is in admin
            const token = req.cookies.authToken;
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if(decoded.username == returnUser[0].username || returnUser[0].username == "admin"){
                const deleteGroupResult = await GroupRepository.deleteAllGroupsByUsernameWOadmin(username);
                if(!deleteGroupResult){
                    return res.status(500).send({
                        success:false,
                        message:"Unable to unlink user from group"
                    });
                }
            }
            else{
                const deleteGroupResult = await GroupRepository.deleteAllGroupByUsername(username);
                if(!deleteGroupResult){
                    return res.status(500).send({
                        success:false,
                        message:"Unable to unlink user from group"
                    });
                }
            }

            //Update groups
            for(let i = 0; i < group.length; i++){
                //Check if group exisit 
                const validGroupResult = await GroupRepository.getGroupByGroupName(group[i]);
                if(validGroupResult.length == 0){
                    return res.status(500).send({
                        success:false
                    });
                }
                else{
                    //Check pivot table if user is in group, else add user into group. To prevent duplicate entry
                    const checkUserInGroup = await GroupRepository.checkUserGroup(username, group[i]);
                    if(checkUserInGroup.length == 0){
                        const insertGroupResult = await GroupRepository.addAccountToGroup(username, group[i]);
                    }
                }
            }

        }
        else{
            //Delete group
            const deleteGroupResult = GroupRepository.deleteAllGroupsByUsernameWOadmin(username);
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

//POST : admin get user profile || URL : /admin/user/profile
exports.adminGetUserProfile = CatchAsyncError(async(req,res,next)=>{
     //CheckGroup
     if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }

    //Check if req.body.username is null
    if(!req.body.username){
        return res.status(500).send({
            success:false,
            message:"username undefined"
        });
    }

    //Get user (username, email, status, groups)
    const returnUser = await AccountRepository.getAccountByUsername(req.body.username);
    //Return Error if user not exist 
    if(!returnUser[0].username){
        return res.status(500).send({
            success:false,
            message:"User not exist"
        });
    }

    //Get user's group
    const returnGroups = await GroupRepository.getAllGroupNameByUsername(returnUser[0].username);

    //Get all groups
    const returnAllGroups = await GroupRepository.getAllGroups();

    if(returnGroups && returnUser){
        return res.status(200).send({
            success:true,
            username: returnUser[0].username,
            email: returnUser[0].email,
            status: returnUser[0].status,
            groups: returnGroups,
            allgroups: returnAllGroups
        });
    }
});

//POST : get user profile || URL : /profile
exports.getUserProfile = CatchAsyncError(async(req,res,next)=>{
    //decode JWT
    if(!req.cookies.authToken){
        res.status(500).send({
            success:false
        });
    }

    const decoded = jwt.verify(req.cookies.authToken, process.env.SECRET_KEY);

    if(decoded){
        //Get user 
        const returnUser = await AccountRepository.getAccountByUsername(decoded.username);
        //Get user group
        const returnGroups = await GroupRepository.getAllGroupNameByUsername(decoded.username);
        if(returnUser && returnGroups){
            return res.status(200).send({
                success:true,
                username:returnUser[0].username,
                status:returnUser[0].status,
                email:returnUser[0].email,
                groups:returnGroups
            });
        }
    }

});

//POST : admin get all groups || URL : /allgroups
exports.adminGetAllGroups = CatchAsyncError(async(req, res,next)=>{
     //CheckGroup
     if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }
    const checkGroupR = await checkGroup(req.body.un, req.body.gn);
    if(!checkGroupR){
        return res.status(500).send({
            success:false,
            message:"unauthrorized"
        });
    }

    //Get all groups and return 
    const allGroups = await GroupRepository.getAllGroups();

    if(allGroups){
        return res.status(200).send({
            success:true,
            groups:allGroups
        });
    }
    return res.status(500).send({
        success:false
    });

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
        message: "welcome",
        token : req.session.authToken
    });
}

