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

router.route('/temp').post(loginAuthentication, checkGroup('admin'), temprotected);


module.exports = router