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
//INPUT: acronym, description, rnumber, startDate, endDate, open(optional), toDo(optional), doing(optional), done(optional)
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
        const today = new Date();
        var tempDateArray = String(req.body.startDate).split("-");
        var checkDate = new Date(tempDateArray[0], parseInt(tempDateArray[1])-1, parseInt(tempDateArray[2])+1);
        if(checkDate < today){
            return res.status(200).send({
                success:true,
                message:"invalid start date"
            });
        } 
        startDate = req.body.startDate;
        //Check endDate < startDate then return an error
        var tempStartDateArray = String(req.body.startDate).split("-");
        var tempStartDate = new Date(tempStartDateArray[0], parseInt(tempStartDateArray[1])-1, parseInt(tempStartDateArray[2])+1);
        var tempEndDateArray = String(req.body.endDate).split("-");
        var tempEndDate = new Date(tempEndDateArray[0], parseInt(tempEndDateArray[1])-1, parseInt(tempEndDateArray[2])+1);
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
        if(checkOpen.length == 0){
            return res.status(200).send({
                success:false,
                message:"invalid group open"
            });
        }
        open = req.body.open;
    }else{
        open = null;
    }
    if(req.body.toDo){
        //Check if group exisit 
        const checkToDo = await GroupRepository.getGroupByGroupName(req.body.toDo);
        if(checkToDo.length == 0){
            return res.status(200).send({
                success:false,
                message:"invalid group toDo"
            });
        }
        toDo = req.body.toDo;
    }
    else{
        toDo = null;
    }
    if(req.body.doing){
        //Check if group exisit 
        const checkDoing = await GroupRepository.getGroupByGroupName(req.body.doing);
        if(checkDoing.length == 0){
            return res.status(200).send({
                success:false,
                message:"invalid group doing"
            });
        }
        doing = req.body.doing;
    }
    else{
        doing = null;
    }
    if(req.body.done){
        //Check if group exisit 
        const checkDone = await GroupRepository.getGroupByGroupName(req.body.done);
        if(checkDone == 0){
            return res.status(200).send({
                success:false,
                message:"invalid group done"
            });
        }
        done = req.body.done;
    }
    else{
        done = null;
    }

    //create app
    try{
        //call the create app query
        const result = await ApplicationRepository.createApplication(acronym,description,rnumber,startDate,endDate,open,toDo,doing,done);
        if(result){
            return res.status(200).send({
                success:true,
                message:"application created",
                err:result
            });
        }

        return res.status(200).send({
            success:false,
            message:"error in creating application"
        });


    }
    catch(err){
        res.status(200).send({
            success:false,
            message:err
        });
    }


});

//POST : create plan || URL : /create-plan || Checkgroup
//INPUT: planName, startDate, endDate, appAcronym(optional), colour
exports.createPlan = CatchAsyncError(async(req,res,next)=>{
    //Check group


    //Get & Check all fields
    var planName, startDate, endDate, appAcronym, colour
    if(!req.body.planName, !req.body.startDate, !req.body.endDate, !req.body.colour, !req.body.appAcronym){
        return res.status(200).send({
            success:false,
            message:"invalid input"
        });
    }
    //Init planName & Colour
    planName = req.body.planName;
    colour = req.body.colour;

    //Check endDate < startDate then return an error
    var tempStartDateArray = String(req.body.startDate).split("-");
    var tempStartDate = new Date(tempStartDateArray[0], parseInt(tempStartDateArray[1])-1, parseInt(tempStartDateArray[2])+1);
    var tempEndDateArray = String(req.body.endDate).split("-");
    var tempEndDate = new Date(tempEndDateArray[0], parseInt(tempEndDateArray[1])-1, parseInt(tempEndDateArray[2])+1);
    if(tempStartDate > tempEndDate){
        return res.status(200).send({
            success:false,
            message:"invalid end date"
        });
    }

    //Check if plan start & end date is in-between app start & end date
    if(req.body.appAcronym){
        try{
            const appResult = await ApplicationRepository.getAppByAcronym(req.body.appAcronym);
            if(appResult.length == 0){
                return res.status(200).send({
                    success:false,
                    message:"invalid application"
                });
            }
            //Check date 
            var tempAppStartDate = appResult[0].App_startDate;
            tempAppStartDate.setDate(tempAppStartDate.getDate() + 1);

            var tempAppEndDate = appResult[0].App_endDate;
            tempAppEndDate.setDate(tempAppEndDate.getDate() + 1);

            if(tempAppStartDate > tempStartDate || tempAppEndDate < tempEndDate){
                return res.status(200).send({
                    success:false,
                    message:"date invalid"
                });
            }
            appAcronym = req.body.appAcronym;
            startDate = req.body.startDate;
            endDate = req.body.endDate;
        }
        catch(err){
            return res.status(200).send({
                success:false,
                message:"invalid application",
                err: err
            });
        }
    }


    //Create plan
    try{
        console.log(planName,startDate,endDate,appAcronym,colour);
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
        return res.status(200).send({
            success:false,
            err:err
        });
    }
});

//POST : create task || URL : /create-task || Checkgroup
//INPUT: taskName, taskDescription(optional), taskNotes(optional), taskId(system), taskPlan, taskApp, taskState(system), taskCreator(system), taskOwner(system), createDate(system), un, gn
exports.createTask = CatchAsyncError(async(req,res,next)=>{
    //Check group

    //Get & check fields 
    var taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator, taskOwner, createDate;
    if(!req.body.taskName, !req.body.taskApp, !req.body.taskCreator, !req.body.taskOwner){
        return res.status(200).send({
            success:false,
            message:"invalid input"
        });
    }
    //Set taskName, taskDesc
    taskName = req.body.taskName;
    //Check if task desc exist  
    if(req.body.taskDescription) taskDescription = req.body.taskDescription;
    taskState = "open";

    //System generate task note
    const tempNow = new Date();
    systemNotes = "system|open|" + tempNow.toISOString();
    taskNotes = systemNotes;
    if(req.body.taskNotes){
        notesRegex = /\|/
        if(notesRegex.tes)
        userNotes = req.body.username + "|open|" + tempNow.toISOString();
        taskNotes.concat("||", userNotes);
    }


    //System generate task id
    const appResult = await ApplicationRepository.getAppByAcronym(req.body.taskApp);
    if(!appResult[0].App_Rnumber){
        return res.status(200).send({
            success:false,
            message:"application not found"
        });
    }
    else{
        //concat task id
        tempAppName = appResult[0].App_Acronym;
        tempAppRnumber = appResult[0].App_Rnumber;
        tempAppRnumber += 1;
        taskId = tempAppName + "_" + tempAppRnumber;
        console.log(appResult[0].App_Acronym);

        //Update Rnumber
        const updateRNumberResult = await ApplicationRepository.updateRnumber(appResult[0].App_Acronym, tempAppRnumber);
        if(!updateRNumberResult){
            return res.status(200).send({
                success:false,
                message:"unable to update app rnumber"
            });
        }
    }

    //System insert creator & taskOwner & createDate
    taskOwner = req.body.taskOwner;
    taskCreator = req.body.taskCreator;
    tempDate = new Date();
    tempDate = tempDate.toISOString();
    tempDate = tempDate.split("T");
    tempDate = tempDate[0];
    createDate = tempDate;
    taskApp = req.body.taskApp;

    //Insert plan if exist 
    if(req.body.taskPlan){
        const resultPlan = await PlanRepository.getPlanByPlanName(req.body.taskPlan);
        if(!resultPlan[0].Plan_MVP_name){
            return res.status(200).send({
                success:false,
                message:"plan is invalid"
            });  
        }
        taskPlan = resultPlan[0].Plan_MVP_name;
    }else{
        taskPlan = null;
    }
    

    //Create task
    try{
        //Check if desc is undefined
        if(!req.body.taskDescription) taskDescription = null;
        console.log(taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator, taskOwner, createDate)
        const resultTask = await TaskRepository.createTask(taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator, taskOwner, createDate);
        if(resultTask){
            return res.status(200).send({
                success:true,
                message:"plan created"
            }); 
        }
        return res.status(200).send({
            success:false,
            message:"error creating task"
        }); 
    }
    catch(err){
        return res.status(200).send({
            success:false,
            message:"error creating task",
            err: err
        }); 
    }
});

//POST : get all application|| URL : /all-application || Checkgroup
exports.getAllApp = CatchAsyncError(async(req,res,next)=>{
    //Checkgroup

    //Get all apps from the 
    const result = await ApplicationRepository.getAllApplication();
    if(!result){
        return res.status(200).send({
            success:false,
            message:"fail to get applications"
        });
    }
    return res.status(200).send({
        success:true,
        apps:result
    });

});

//POST : get all plans by app || URL : /all-plan/app || Checkgroup
//INPUT: app_Acronym
exports.getPlanByApp = CatchAsyncError(async(req,res,next)=>{
    //check group

    //Get plans by app 
    if(!req.body.app_Acronym){
        return res.status(200).send({
            success:false,
            message:"invalid acronym"
        });
    }
    const result = await PlanRepository.getAllPlanByApp(req.body.app_Acronym);
    console.log(result)
    if(result.length == 0){
        return res.status(200).send({
            success:false,
            plans:result
        });
    }else{
        return res.status(200).send({
            success:true,
            plans:result
        });
    }


});

//POST : get task by app || URL : /all-task/app || Checkgroup
//INPUT: app_Acronym
exports.getTaskByApp = CatchAsyncError(async(req,res,next)=>{
    //checkgroup

    //get tasks by app
    if(!req.body.app_Acronym){
        return res.status(200).send({
            success:false,
            message:"invalid input for app_Acronym"
        });
    }
    const result = await TaskRepository.getTaskByApp(req.body.app_Acronym);
    if(result.length == 0){
        return res.status(200).send({
            success:false,
            tasks:result
        });
    }
    return res.status(200).send({
        success:true,
        tasks:result
    });
});

//POST : get task by plan || URL : /all-task/plan || Checkgroup
//INPUT: planName
exports.getTaskByPlan = CatchAsyncError(async(req,res,next)=>{
    //checkgroup

    //get tasks by app
    if(!req.body.planName){
        return res.status(200).send({
            success:false,
            message:"invalid input for plan name"
        });
    }
    const result = await TaskRepository.getTaskByPlan(req.body.planName);
    if(result.length == 0){
        return res.status(200).send({
            success:false,
            tasks:result
        });
    }
    return res.status(200).send({
        success:true,
        tasks:result
    });
});

//POST : get task by taskName || URL : /task/task-name || Checkgroup
//INPUT: taskName
exports.getTaskByTaskName = CatchAsyncError(async(req,res,next)=>{
    //checkgroup

    //get tasks by app
    if(!req.body.taskName){
        return res.status(200).send({
            success:false,
            message:"invalid input for task name"
        });
    }
    const result = await TaskRepository.getTaskByTaskName(req.body.taskName);
    if(result.length == 0){
        return res.status(200).send({
            success:false,
            tasks:result
        });
    }
    return res.status(200).send({
        success:true,
        tasks:result
    });
});

//POST : Project leader update task || URL : /update/task || Checkgroup
//INPUT: taskName, un, gn, userNotes, taskState, acronym
exports.plUpdateTask = CatchAsyncError(async(req,res,next)=>{
    //Checkgroup

    //Create all required variables to edit
    var taskNotes;

    //Check task state 
    if(!req.body.taskName){
        return res.status(200).send({
            success:false,
            message:"invalid task name"
        });
    }
    const taskResult = await TaskRepository.getTaskByTaskName(req.body.taskName);
    if(!taskResult[0].Task_name){
        return res.status(200).send({
            success:false,
            message:"task not found"
        })
    }
    if(taskResult[0].Task_state !== "done"){
        return res.status(200).send({
            success:false,
            message:"unable to edit task"
        })
    }

    //Get & check valid fields 
    //Add notes
    taskNotes = taskResult[0].Task_notes;
    //System generate notes
    var today = new Date()
    tempSystemNotes = "system|" + taskResult[0].Task_state + "|" + today.toISOString();
    taskNotes.concat(",", tempSystemNotes);
    //User add notes if exist 
    if(req.body.userNotes){
        tempUserNotes = req.body.un + "|" + taskResult[0].Task_state + "|" + today.toISOString();
        taskNotes.concat(",", tempUserNotes);
    }

    //Edit state
    if(!req.body.taskState){
        return res.status(200).send({
            success:false,
            message:"invalid task state"
        });
    }
    if(req.body.taskState != "closed" || req.body.taskState != "doing" || req.body.taskState != "done"){
        return res.status(200).send({
            success:false,
            message:"invalid task state"
        });
    }

    //edit plan
    if(!req.body.plan){
        return res.status(200).send({
            success:false,
            message:"invalid plan"
        });
    }
    //Check plan if is assoisated with the application
    const checkPlan = await PlanRepository.getPlanByPlanNameNApp(req.body.plan, req.body.acronym);
    if(!checkPlan[0].Plan_MVP_name){
        return res.status(200).send({
            success:false,
            message:"invalid plan"
        });res
    }


    //Update task 
    try{
        const updateResult = await TaskRepository.updateTask(taskNotes, checkPlan[0].Plan_MVP_name, req.body.un,taskResult[0].Task_id, req.body.taskState);
        if(updateResult){
            return res.status(200).send({
                success:true,
                message:"PL updated task"
            });
        }
        return res.status(200).send({
            success:false,
            message:"error in updating task"
        });
    }
    catch(err){
        return res.status(200).send({
            success:false,
            message:"error in updating task",
            err: err
        });

    }
});

//POST : Project manager update task || URL : /update/task || Checkgroup
exports.pmUpdateTask = CatchAsyncError(async(req,res,next)=>{
    
});

//POST : Team update task || URL : /update/task || Checkgroup

//POST : update task state || URL : /update/task/state || Checkgroup

//POST : update application || URL : /update/application || Checkgroup

//POST : update plan || URL : /update/plan || Checkgroup


