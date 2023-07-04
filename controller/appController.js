//Import repository 
const ApplicationRepository = require("../repository/applicationRepository");
const PlanRepository = require("../repository/planRepository");
const TaskRepository = require("../repository/taskRepository");
const GroupRepository = require("../repository/groupRepository");

//Import JWT
const {generateJWT} = require('../utils/jwtUtils');

//Import JWT token
const jwt = require('jsonwebtoken')

//Import catch Async error & error handler
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/catchAsyncError');

//Import Checkgroup
const {checkGroup} = require('../middleware/checkGroup');


//POST : create application || URL : /create-application || Checkgroup
exports.createApplication = CatchAsyncError(async(req, res, next)=>{
    //checkgroup

    //Get & Check for all fields 
    var acronym, description, rnumber, startDate, endDate, open, toDo, doing, done;

    //Check for mandatory fields 
    if(!req.body.acronym, !req.body.description, !req.body.rnumber, !req.body.startDate, !req.body.endDate){
        res.status(200).send({
            success:false,
            message:"Input require fields"
        });
    }else{
        acronym = req.body.acronym;
        description = req.body.description;
        rnumber = req.body.rnumber;
        //Check startDate < current date then return error
        var currentDate = Date();
        var tempDateArray = req.body.startDate.spilt("-");
        var checkDate = Date(tempDateArray[0], tempDateArray[1], tempDateArray[2]);
        if(checkDate < currentDate){
            return res.status(200).send({
                success:true,
                message:"invalid start date"
            });
        } 
        startDate = req.body.startDate;
        //Check endDate < startDate then return an error
        var tempStartDateArray = req.body.startDate.spilt(",");
        var tempStartDate = Date(tempStartDateArray[0], tempStartDateArray[1], tempStartDateArray[2]);
        var tempEndDateArray = req.body.endDate.spilt(",");
        var tempEndDate = DatE(tempEndDateArray[0], tempEndDateArray[1], tempEndDateArray[2]);
        if(tempStartDate > tempEndDate){
            return res.status(200).send({
                success:false,
                message:"invalid end date"
            });
        }
        endDate = req.body.endDate;
    }
    if(req.body.open){
        //Check if group exisit 
        const checkOpen = await GroupRepository.getGroupByGroupName(req.body.open);
        if(!checkOpen){
            return res.status(200).send({
                success:false,
                message:"invalid group open"
            });
        }
        open = req.body.open;
    }
    if(req.body.toDo){
        //Check if group exisit 
        const checkToDo = await GroupRepository.getGroupByGroupName(req.body.toDo);
        if(!checkToDo){
            return res.status(200).send({
                success:false,
                message:"invalid group toDo"
            });
        }
        toDo = req.body.toDo;
    }
    if(req.body.doing){
        //Check if group exisit 
        const checkDoing = await GroupRepository.getGroupByGroupName(req.body.doing);
        if(!checkDoing){
            return res.status(200).send({
                success:false,
                message:"invalid group doing"
            });
        }
        doing = req.body.doing;
    }
    if(req.body.done){
        //Check if group exisit 
        const checkDone = await GroupRepository.getGroupByGroupName(req.body.done);
        if(!checkDone){
            return res.status(200).send({
                success:false,
                message:"invalid group done"
            });
        }
        done = req.body.done;
    }

    //create app
    try{
        //call the create app query
        const result = ApplicationRepository.createApplication(acronym,description,rnumber,startDate,endDate,open,toDo,doing,done);
        if(result){
            return res.status(200).send({
                success:true,
                message:"application created"
            });
        }
        else{
            return res.status(200).send({
                success:false,
                message:"error in creating application"
            });
        }

    }
    catch(err){
        res.status(200).send({
            success:false,
            message:err
        });
    }


});

//POST : create plan || URL : /create-plan || Checkgroup
exports.createPlan = CatchAsyncError(async(req,res,next)=>{
    //Check group


    //Get & Check all fields
    var planName, startDate, endDate, appAcronym, colour
    if(!req.body.planName, !req.body.startDate, !req.body.endDate, !req.body.colour){
        return res.status(200).send({
            success:false,
            message:"invalid input"
        });
    }
    //Init planName & Colour
    planName = req.body.planName;
    colour = req.body.colour;

    //Check startDate < current date then return error
    var currentDate = Date();
    var tempDateArray = req.body.startDate.spilt("-");
    var checkDate = Date(tempDateArray[0], tempDateArray[1], tempDateArray[2]);
    if(checkDate < currentDate){
        return res.status(200).send({
            success:true,
            message:"invalid start date"
        });
    } 
    startDate = req.body.startDate;
    //Check endDate < startDate then return an error
    var tempStartDateArray = req.body.startDate.spilt(",");
    var tempStartDate = Date(tempStartDateArray[0], tempStartDateArray[1], tempStartDateArray[2]);
    var tempEndDateArray = req.body.endDate.spilt(",");
    var tempEndDate = DatE(tempEndDateArray[0], tempEndDateArray[1], tempEndDateArray[2]);
    if(tempStartDate > tempEndDate){
        return res.status(200).send({
            success:false,
            message:"invalid end date"
        });
    }
    endDate = req.body.endDate;

    //Check if plan start & end date is in-between app start & end date
    if(req.body.appAcronym){
        const appResult = await ApplicationRepository.getAppByAcronym(req.body.appAcronym);
        if(!appResult){
            return res.status(200).send({
                success:false,
                message:"invalid application"
            });
        }
        //Check date 
        var tempAppStartDateArray = appResult[0].startDate.spilt(",");
        var tempAppStartDate = Date(tempAppStartDateArray[0], tempAppStartDateArray[1], tempAppStartDateArray[2]);
        var tempAppEndDateArray = appResult[0].endDate.spilt(",");
        var tempAppEndDate = Date(tempAppEndDateArray[0], tempAppEndDateArray[1], tempAppEndDateArray[2]);

        if(tempAppStartDate > tempStartDate || tempAppEndDate < tempEndDate){
            return res.status(200).send({
                success:false,
                message:"date invalid"
            });
        }
        appAcronym = req.body.appAcronym;
    }


    //Create plan
    try{
        const result = await PlanRepository.createPlan(planName,startDate,endDate,appAcronym,colour);
        if(result){
            return res.status(200).send({
                success:true,
                message:"plan created"
            });
        }
        return res.status(200).send({
            success:false,
            message:"error in creating plan"
        });
    }
    catch(err){

    }
});

//POST : create task || URL : /create-task || Checkgroup
exports.createTask = CatchAsyncError(async(req,res,next)=>{
    //Check group

    //Get & check fields 
    var taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator, taskOwner, startDate;
    if(!req.body.taskName, !req.body.taskDescription, !req.body.taskApp, !req.body.startDate, !req.body.taskApp, !req.body.username){
        return res.status(200).send({
            success:false,
            message:"invalid input"
        });
    }
    //Set taskName, taskDesc
    taskName = req.body.taskName;
    taskDescription = req.body.taskDescription;

    //System generate task note
    const tempNow = Date();
    systemNotes = req.body.username + "|open|" + tempNow.toISOString(); + ",";
    taskNotes = systemNotes;
    if(req.body.taskNotes){
        userNotes = req.body.username + "|open|" + tempNow.toISOString() + ",";
    }


    //System generate task id
    const appResult = await ApplicationRepository.getAppByAcronym(req.body.taskApp);
    if(!appResult[0].App_Acronym){
        return res.status(200).send({
            success:false,
            message:"application not found"
        });
    }
    taskId = appResult[0].App_Acronym + "_" + appResult[0].App_Rnumber;

    //System insert creator & taskOwner

    //Check if plan start date < task start date 

    //Check if app start date < task start date

    //Create task
});

//POST : get all application|| URL : /all-application || Checkgroup

//POST : get all plans by app || URL : /all-plans || Checkgroup

//POST : get task by app || URL : /task-by-app || Checkgroup

//POST : get task by plan || URL : /task-by-plan || Checkgroup

//POST : get task by taskName || URL : /task-by-taskname || Checkgroup

//POST : update task || URL : /update/task || Checkgroup

//POST : update task state || URL : /update/task/state || Checkgroup


