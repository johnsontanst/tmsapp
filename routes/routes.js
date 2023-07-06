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

const{
    createApplication,
    createPlan,
    createTask,
    getAllApp,
    getPlanByApp,
    getTaskByApp,
    getTaskByPlan,
    getTaskByTaskName,
    plUpdateTask,
    pmUpdateTask,
    teamUpdateTask,
    plUpdateApp,
    getAppByAcronym

} = require("../controller/appController")

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

//ROUTE: Admin get all groups (Only admins, PL, PM, TEAM) || checkgroup
router.route('/allgroups').post(loginAuthentication, adminGetAllGroups);

/* END */
/* Application, Plan, Task ROUTES */

//ROUTE: Project leader create application || checkgroup
router.route('/create-application').post(createApplication);

//ROUTE: Project manager create plan || checkgroup
router.route('/create-plan').post(createPlan);

//ROUTE: Project leader create task || checkgroup
router.route('/create-task').post(createTask);

//ROUTE: Project leader get all apps || checkgroup
router.route('/all-application').post(getAllApp);

//ROUTE: Project leader get app by app acronym || checkgroup
router.route('/get-application').post(getAppByAcronym);

//ROUTE: PL, PM, DT get plans based on Apps || checkgroup
router.route('/all-plan/app').post(getPlanByApp);

//ROUTE: PL, PM, DT get tasks based on Apps || checkgroup
router.route('/all-task/app').post(getTaskByApp);

//ROUTE: PL, PM, DT get tasks based on Plan || checkgroup
router.route('/all-task/plan').post(getTaskByPlan);

//ROUTE: PL, PM, DT get tasks based on Task name || checkgroup
router.route('/task/task-name').post(getTaskByTaskName);

//ROUTE: PL update task || checkgroup
router.route('/pl-update/task').post(plUpdateTask);

//ROUTE: PM update task || checkgroup
router.route('/pm-update/task').post(pmUpdateTask);

//ROUTE: PM update task || checkgroup
router.route('/team-update/task').post(teamUpdateTask);

//ROUTE: PL update application || checkgroup
router.route('/update/application').post(plUpdateApp);


/* END */

//Test route
router.route('/temp').post(loginAuthentication, temprotected);
router.route('/').get(welcome);


module.exports = router