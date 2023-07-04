//Import express and router
const express = require('express')
const router = express.Router()


//Import controllers
const {
    newAccountC,
    loginC,
    temprotected,
    newGroupC,
    addUserToGroupC,
    welcome,
    logoutC,
    authTokenCheckRole,
    allUsersC,
    updateUser,
    adminUpdateUser,
    getUserProfile,
    adminGetUserProfile,
    adminGetAllGroups,

    } = require('../controller/accountController');

//Import authentication & checkgroup middleware
const {loginAuthentication} = require('../middleware/authentication');


/* Account ROUTES */

//ROUTE: Register new account || checkgroup
router.route('/register').post(loginAuthentication, newAccountC); 

//ROUTE: Register new group || checkgroup
router.route('/register/group').post(loginAuthentication, newGroupC);

//ROUTE: Login
router.route('/login').post(loginC);

//ROUTE: Logout user
router.route('/logout').post(logoutC);

//ROUTE: Add user into group || NOT IN USED
//router.route('/add/usertogroup').post(addUserToGroupC);

//ROUTE: auth token check role and return user info
router.route('/authtoken/return/userinfo').post(authTokenCheckRole);

//ROUTE: Get all users (Only admins) || checkgroup
router.route('/allusers').post(loginAuthentication, allUsersC);

//ROUTE: User change email/password
router.route('/update/user').post(loginAuthentication, updateUser);

//ROUTE: Get user profile 
router.route('/profile').post(loginAuthentication, getUserProfile);

//ROUTE: Admin get user profiles || checkgroup
router.route('/admin/user/profile').post(loginAuthentication, adminGetUserProfile); 

//ROUTE: Admin modify user email/password/status/group || checkgroup
router.route('/admin/update/user').post(loginAuthentication, adminUpdateUser); 

//ROUTE: Admin get all groups (Only admins) || checkgroup
router.route('/allgroups').post(loginAuthentication, adminGetAllGroups);

/* END */
/* Application, Plan, Task ROUTES */



/* END */

//Test route
router.route('/temp').post(loginAuthentication, temprotected);
router.route('/').get(welcome);


module.exports = router