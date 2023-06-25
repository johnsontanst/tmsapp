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
const {checkGroup} = require('../middleware/checkGroup');


//ROUTE: Register new account
router.route('/register').post(newAccountC);

//ROUTE: Register new group
router.route('/register/group').post(loginAuthentication, checkGroup('admin'), newGroupC);

//ROUTE: Login
router.route('/login').post(loginC);

//ROUTE: Logout user
router.route('/logout').post(logoutC);

//ROUTE: Add user into group
router.route('/add/usertogroup').post(addUserToGroupC);

//ROUTE: auth token check role
router.route('/authtoken/checkrole').post(authTokenCheckRole)

//ROUTE: Get all users (Only admins)
router.route('/allusers').post(loginAuthentication, checkGroup('admin'),allUsersC);

//ROUTE: User chaange email/password
router.route('/update/user').post(loginAuthentication, updateUser);

//ROUTE: Get user profile 
router.route('/profile').post(loginAuthentication, getUserProfile);

//ROUTE: Admin get user profiles
router.route('/admin/user/profile').post(loginAuthentication, checkGroup('admin'), adminGetUserProfile);

//ROUTE: Admin modify user email/password/status/group
router.route('/admin/update/user').post(loginAuthentication, checkGroup('admin'), adminUpdateUser);

//ROUTE: Admin get all groups (Only admins)
router.route('/allgroups').post(loginAuthentication, checkGroup('admin'), adminGetAllGroups);

//Test route
router.route('/temp').post(loginAuthentication, temprotected);
router.route('/').get(welcome);


module.exports = router