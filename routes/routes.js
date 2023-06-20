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

    } = require('../controller/accountController');

//Import authentication & checkgroup middleware
const {loginAuthentication} = require('../middleware/authentication');
const {checkGroup} = require('../middleware/checkGroup');


//ROUTE: Register new account
router.route('/register').post(newAccountC);

//ROUTE: Login
router.route('/login').post(loginC);

//ROUTE: Register new group
router.route('/register/group').post(newGroupC);

//ROUTE: Add user into group
router.route('/add/usertogroup').post(addUserToGroupC);

//ROUTE: Logout user
router.route('/logout').post(logoutC);


//Test route
router.route('/temp').post(loginAuthentication, checkGroup('projectLeader'), temprotected);
router.route('/').get(welcome);


module.exports = router