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

    } = require('../controller/accountController');

//Import authentication & checkgroup middleware
const {loginAuthentication} = require('../middleware/authentication');
const {checkGroup} = require('../middleware/checkGroup');


//ROUTE: Register new account
router.route('/register').post(newAccountC);

//ROUTE: Register new group
router.route('/register/group').post(newGroupC);

//ROUTE: Login
router.route('/login').post(loginC);

//ROUTE: Logout user
router.route('/logout').post(logoutC);

//ROUTE: Add user into group
router.route('/add/usertogroup').post(addUserToGroupC);

//ROUTE: auth token check role
router.route('/authtoken/checkrole').post(authTokenCheckRole)

//ROUTE: auth get all users
router.route('/allusers').post(loginAuthentication, checkGroup('admin'),allUsersC)

//Test route
router.route('/temp').post(loginAuthentication, temprotected);
router.route('/').get(welcome);


module.exports = router