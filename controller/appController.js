//Import repository 
const ApplicationRepository = require("../repository/applicationRepository");
const PlanRepository = require("../repository/planRepository");
const TaskRepository = require("../repository/taskRepository");
const GroupRepository = require("../repository/groupRepository");
const AccountRepository = require("../repository/accountRepository");

//import nodemailer
const {nodemail} = require("../utils/transporter");

//Import JWT
const {generateJWT} = require('../utils/jwtUtils');

//Import JWT token
const jwt = require('jsonwebtoken')

//Import catch Async error & error handler
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/catchAsyncError');

//Import Checkgroup
const {checkGroup} = require('../middleware/checkGroup');
const catchAsyncError = require("../middleware/catchAsyncError");


//POST : create application || URL : /create-application || Checkgroup
//INPUT: acronym, description, rnumber, startDate, endDate, open(optional), toDo(optional), doing(optional), done(optional), un, gn
exports.createApplication = CatchAsyncError(async(req, res, next)=>{
    //checkgroup
    if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        })
    }

    if(!checkGroup(req.body.un, req.body.gn)){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        })
    }

    //Get & Check for all fields 
    var acronym, description, rnumber, startDate, endDate, create, open, toDo, doing, done;

    //Check for mandatory fields 
    if(!req.body.acronym, !req.body.description, !req.body.rnumber, !req.body.startDate, !req.body.endDate){
        res.status(500).send({
            success:false,
            message:"Input require fields"
        });
    }else{
        acronym = req.body.acronym;
        description = req.body.description;
        if(parseInt(req.body.rnumber) < 0){
            return res.status(500).send({
                success:false,
                message:"rnumber cannot be less than zero"
            })
        }
        rnumber = req.body.rnumber;
        //Check startDate < current date then return error
        const today = new Date();
        var tempDateArray = String(req.body.startDate).split("-");
        var checkDate = new Date(tempDateArray[0], parseInt(tempDateArray[1])-1, parseInt(tempDateArray[2])+1);
        if(checkDate < today){
            return res.status(500).send({
                success:true,
                message:"invalid start date"
            });
        } 
        startDate = checkDate;
        //Check endDate < startDate then return an error
        var tempStartDateArray = String(req.body.startDate).split("-");
        var tempStartDate = new Date(tempStartDateArray[0], parseInt(tempStartDateArray[1])-1, parseInt(tempStartDateArray[2])+1);
        var tempEndDateArray = String(req.body.endDate).split("-");
        var tempEndDate = new Date(tempEndDateArray[0], parseInt(tempEndDateArray[1])-1, parseInt(tempEndDateArray[2])+1);
        if(tempStartDate > tempEndDate){
            return res.status(500).send({
                success:false,
                message:"invalid end date"
            });
        }
        endDate = tempEndDate;
    }
    if(req.body.create){
        //Check if group exisit 
        const checkCreate = await GroupRepository.getGroupByGroupName(req.body.create);
        if(checkCreate.length == 0){
            return res.status(500).send({
                success:false,
                message:"invalid group open"
            });
        }
        create = req.body.create;
    }else{
        create = null;
    }
    if(req.body.open){
        //Check if group exisit 
        const checkOpen = await GroupRepository.getGroupByGroupName(req.body.open);
        if(checkOpen.length == 0){
            return res.status(500).send({
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
            return res.status(500).send({
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
            return res.status(500).send({
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
            return res.status(500).send({
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
        const result = await ApplicationRepository.createApplication(acronym,description,rnumber,startDate,endDate,create,open,toDo,doing,done);
        console.log(result);
        if(result){
            return res.status(200).send({
                success:true,
                message:"application created"
            });
        }

        return res.status(500).send({
            success:false,
            message:"error in creating application"
        });


    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:err
        });
    }


});

//POST : create plan || URL : /create-plan || Checkgroup
//INPUT: planName, startDate, endDate, appAcronym, colour
exports.createPlan = CatchAsyncError(async(req,res,next)=>{
    //Check group
    if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        })
    }
    if(!await checkGroup(req.body.un, req.body.gn)){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        }) 
    }


    //Get & Check all fields
    var planName, startDate, endDate, appAcronym, colour
    if(!req.body.planName, !req.body.startDate, !req.body.endDate, !req.body.colour, !req.body.appAcronym){
        return res.status(500).send({
            success:false,
            message:"missing input"
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
        return res.status(500).send({
            success:false,
            message:"invalid end date"
        });
    }

    //Check if plan start & end date is in-between app start & end date
    if(req.body.appAcronym){
        try{
            const appResult = await ApplicationRepository.getAppByAcronym(req.body.appAcronym);
            if(appResult.length == 0){
                return res.status(500).send({
                    success:false,
                    message:"invalid application"
                });
            }
            //Check date 
            var tempAppStartDate = appResult[0].App_startDate;
            tempAppStartDate.setDate(tempAppStartDate.getDate());

            var tempAppEndDate = appResult[0].App_endDate;
            tempAppEndDate.setDate(tempAppEndDate.getDate() + 1);

            if(tempAppStartDate > tempStartDate || tempAppEndDate < tempEndDate){
                return res.status(500).send({
                    success:false,
                    message:"date invalid"
                });
            }
            appAcronym = req.body.appAcronym;
            startDate = tempAppStartDate;
            endDate = tempAppEndDate;
        }
        catch(err){
            return res.status(500).send({
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
        return res.status(500).send({
            success:false,
            message:"error in creating plan"
        });
    }
    catch(err){
        return res.status(500).send({
            success:false,
            err:err
        });
    }
});

//POST : create task || URL : /create-task || Checkgroup
//INPUT: taskName, taskDescription(optional), taskNotes(optional), taskId(system), taskPlan, taskApp, taskState(system), taskCreator, taskOwner, createDate(system), un, gn
exports.createTask = CatchAsyncError(async(req,res,next)=>{
    //Check group
    if(!req.body.un || !req.body.gn){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        })
    }
    if(!await checkGroup(req.body.un, req.body.gn)){
        return res.status(500).send({
            success:false,
            message:"not authorized"
        }) 
    }

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
    let systemNotes = "system|open|" + tempNow.toISOString() + "|Task created";
    taskNotes = systemNotes;
    if(req.body.taskNotes){
        const notesRegex = /\|/
        if(!notesRegex.test(req.body.taskNotes)){
            var userNotes = req.body.un + "|open|" + tempNow.toISOString() + "|" + req.body.taskNotes;
            console.log(userNotes);
            taskNotes += "||" + userNotes;
            console.log(taskNotes);
        }
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
    //return applications list
    var applicationList = [];

    if(!req.body.un){
        return res.status(500).send({
            success:false,
            message:"username undefined"
        })
    }

    //Get all apps from the 
    const result = await ApplicationRepository.getAllApplication();
    for(const k in result){
        //create an array based on create, open, toDolist, doing and done
        let tempAppArray = [];
        if(result[k].App_permit_Create != null) tempAppArray.push(result[k].App_permit_Create);
        if(result[k].App_permit_Open != null) tempAppArray.push(result[k].App_permit_Open);
        if(result[k].App_permit_toDoList != null) tempAppArray.push(result[k].App_permit_toDoList);
        if(result[k].App_permit_Doing != null) tempAppArray.push(result[k].App_permit_Doing);
        if(result[k].App_permit_Done != null) tempAppArray.push(result[k].App_permit_Done);

        //Create an array based on user groups 
        let tempGroupResult = await GroupRepository.getAllGroupNameByUsername(req.body.un);
        let tempUserArray = [];
        for(const k in tempGroupResult){
            tempUserArray.push(tempGroupResult[k].groupName)
        }

        if(tempAppArray.some(r=> tempUserArray.includes(r))){
            applicationList.push(result[k]);
        }
    }
    if(!result){
        return res.status(500).send({
            success:false,
            message:"fail to get applications"
        });
    }
    return res.status(200).send({
        success:true,
        apps:result
    });

});

//POST : get application by App Acronym || URL : /get-application|| Checkgroup
//INPUT: acronym
exports.getAppByAcronym = CatchAsyncError(async(req,res,next)=>{
    //checkgroup

    //Get & check the fields
    if(!req.body.acronym){
        return res.status(500).send({
            success:false,
            message:"App acronym not found"
        });
    }
    const appResult = await ApplicationRepository.getAppByAcronym(req.body.acronym);
    if(!appResult[0].App_Acronym){
        return res.status(500).send({
            success:false,
            message:"App acronym not found"
        });
    }
    return res.status(200).send({
        success:true,
        apps:appResult
    })
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

//POST : get all plans by app || URL : /get-plan/planname|| Checkgroup
//INPUT: planName
exports.getPlanByPlanName = CatchAsyncError(async(req,res,next)=>{
    //check group

    //Get & check fields
    if(!req.body.planName){
        return res.status(200).send({
            success:false,
            message:"no input"
        });
    }
    //check if plan exist 
    const planResult = await PlanRepository.getPlanByPlanName(req.body.planName);
    if(!planResult[0].Plan_MVP_name){
        return res.status(200).send({
            success:false,
            message:"invalid plan"
        })
    }
    return res.status(200).send({
        success:true,
        plan:planResult
    })

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
    console.log(req.body.app_Acronym);
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

//POST : get task by taskId || URL : /task/task-id || Checkgroup
//INPUT: task_id
exports.getTaskByTaskId = catchAsyncError(async(req,res,next)=>{
    //checkgroup

    //Get & check fields
    if(!req.body.taskId){
        return res.status(500).send({
            success:false,
            message:"task id invalid"
        })
    }

    //Query task by task id
    const taskResult = await TaskRepository.getTaskByTaskId(req.body.taskId);

    if(!taskResult[0].Task_name){
        return res.status(500).send({
            success:false,
            message:"no task found"
        })
    }
    return res.status(200).send({
        success:true,
        task:taskResult
    })

});


//POST : Project leader update task || URL : /pl-update/task || Checkgroup
//INPUT: taskId, un, gn, userNotes, taskState, acronym, plan
exports.plUpdateTask = CatchAsyncError(async(req,res,next)=>{
    //Checkgroup
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

    //Create all required variables to edit
    var taskNotes , newPlan

    //Check task state 
    if(!req.body.taskId){
        return res.status(500).send({
            success:false,
            message:"invalid task id"
        });
    }
    const taskResult = await TaskRepository.getTaskByTaskId(req.body.taskId);
    if(!taskResult[0].Task_name){
        return res.status(500).send({
            success:false,
            message:"task not found"
        })
    }
    if(taskResult[0].Task_state !== "done"){
        return res.status(500).send({
            success:false,
            message:"unable to edit task"
        })
    }

    //Edit state
    if(!req.body.taskState){
        return res.status(500).send({
            success:false,
            message:"invalid task state"
        });
    }
    if(req.body.taskState === "closed" || req.body.taskState === "doing" || req.body.taskState === "done"){

    }
    else{
        return res.status(500).send({
            success:false,
            message:"invalid task state"
        });
    }


    //edit plan
    //Check plan if is assoisated with the application
    if(!req.body.plan){
        newPlan = null;
    }else{
        const checkPlan = await PlanRepository.getPlanByPlanNameNApp(req.body.plan, req.body.acronym);
        if(checkPlan[0].Plan_MVP_name){
            newPlan = checkPlan[0].Plan_MVP_name;
        }
    }

    //Get & check valid fields 
    //Add notes
    taskNotes = String(taskResult[0].Task_notes);
    //System generate notes
    var today = new Date()
    var updateStateNotes = "UPDATED TASK STATE:" + req.body.taskState + " USER:" + req.body.un;
    var tempSystemNotes = "system|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + updateStateNotes;
    taskNotes += "||" + tempSystemNotes;

    //User add notes if exist 
    if(req.body.userNotes){
        var tempUserNotes = req.body.un + "|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + req.body.userNotes;
        taskNotes += "||" + tempUserNotes;
    }


    //Update task 
    try{
        //console.log(taskNotes, checkPlan[0].Plan_MVP_name, req.body.un,taskResult[0].Task_id, req.body.taskState)
        const updateResult = await TaskRepository.updateTask(taskNotes, newPlan, req.body.un,taskResult[0].Task_id, req.body.taskState);
        if(updateResult){
            return res.status(200).send({
                success:true,
                message:"PL updated task"
            });
        }
        return res.status(500).send({
            success:false,
            message:"error in updating task"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success:false,
            message:"error in updating task",
            err: err
        });

    }
});

//POST : Project manager update task || URL : /pm-update/task || Checkgroup
//INPUT: taskId, un, gn, taskState, userNotes, acronym, taskPlan, devTeam(optional/void), devInGroupName(optional/void)
exports.pmUpdateTask = CatchAsyncError(async(req,res,next)=>{
    //checkgroup
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

    //Fields require to be change
    var taskNotes, updateOwner
    //check task state
    if(!req.body.taskId ,!req.body.taskPlan, !req.body.acronym){
        return res.status(500).send({
            success:false,
            message:"invalid task id"
        });
    }
    const taskResult = await TaskRepository.getTaskByTaskId(req.body.taskId);
    if(!taskResult[0].Task_name){
        return res.status(500).send({
            success:false,
            message:"invalid task id"
        });
    }
    if(taskResult[0].Task_state === "open" || taskResult[0].Task_state === "todo"){
        
    }
    else{
        return res.status(500).send({
            success:false,
            message:"unable to access task"
        });
    }


    //Get & check fields
    //Change state
    if(!req.body.taskState){
        return res.status(500).send({
            success:false,
            message:"invalid task state"
        });
    }
    if(req.body.taskState === "open" || req.body.taskState === "todo"){

    }
    else{
        return res.status(500).send({
            success:false,
            message:"invalid task state"
        });
    }

    //Change owner
    // if(req.body.devTeam && req.body.devInGroupName && req.body.taskState === "todo"){
    //     //Check if devTeam member exist in the group KIV!!!!!!
    //     const checkDevTeam = await checkGroup(req.body.devTeam, req.body.devInGroupName);
    //     if(!checkDevTeam){
    //         return res.status(200).send({
    //             success:false,
    //             message:"dev not in the group"
    //         })
    //     }
    //     updateOwner = req.body.devTeam;
    // }else{
    //     if(req.body.taskState === "open"){
    //         updateOwner = req.body.un;
    //     }else{
    //         updateOwner = null;
    //     }
    // }
    // console.log(updateOwner)

    //Check plan if exist
    if(req.body.taskPlan){
        //check if plan exist in application
        const checkPlan = await PlanRepository.getPlanByPlanNameNApp(req.body.taskPlan, req.body.acronym);
        if(!checkPlan[0].Plan_MVP_name){
            return res.status(500).send({
                success:false,
                message:"invalid plan"
            });
        }

    }

    //Notes 
    //System generate notes
    taskNotes = taskResult[0].Task_notes;
    //System generate notes
    var today = new Date()
    updateStateNotes = "UPDATED TASK STATE:" + req.body.taskState + " USER:" + req.body.un;
    if(req.body.taskPlan != taskResult[0].Task_plan){
        updateStateNotes.concat("|Update task plan:", req.body.taskPlan);
    }
    tempSystemNotes = "system|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + updateStateNotes;
    taskNotes = taskNotes.concat("||", tempSystemNotes);
    //User add notes if exist 
    if(req.body.userNotes){
        console.log(req.body.userNotes);
        tempUserNotes = req.body.un + "|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + req.body.userNotes;
        taskNotes = taskNotes.concat("||", tempUserNotes);
    }


    //Update task
    try{
        console.log(taskNotes, req.body.un, req.body.taskId, req.body.taskState);
        //Set task plan
        let taskPlan
        if(!req.body.taskPlan){
            taskPlan = null;
        }
        else{
            taskPlan = req.body.taskPlan;
        }
        const result = await TaskRepository.updateTask(taskNotes, taskPlan, req.body.un, req.body.taskId, req.body.taskState);
        if(result){
            return res.status(200).send({
                success:true,
                message:"task updated"
            });
        }
        return res.status(500).send({
            success:false,
            message:"error in updating task"
        });
    }
    catch(err){
        return res.status(500).send({
            success:false,
            message:"error in updating task",
            err: err
        });
    }

});

//POST : Team update task || URL : /team-update/task || Checkgroup
//INPUT: taskId, un, gn, taskState, userNotes
exports.teamUpdateTask = CatchAsyncError(async(req,res,next)=>{
    //checkgroup
    console.log(req.body.un, req.body.gn)
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

    //Fields require to be change
    var updateTaskState, taskNotes;
    //Get & check fields 
    //check if task exist 
    if(!req.body.taskId, !req.body.taskState){
        return res.status(500).send({
            success:false,
            message:"invalid task id"
        });
    }
    const taskResult = await TaskRepository.getTaskByTaskId(req.body.taskId);
    if(!taskResult[0].Task_id){
        return res.status(500).send({
            success:false,
            message:"invalid task id"
        });
    }


    //check state and set update state
    if(taskResult[0].Task_state === "todo" || taskResult[0].Task_state === "doing"){

    }
    else{
        return res.status(500).send({
            success:false,
            message:"unable to update task"
        });
    }

    if(!req.body.taskState){
        return res.status(500).send({
            success:false,
            message:"invalid task state"
        });
    }
    if(taskResult[0].Task_state === "todo" && req.body.taskState === "done"){
        return res.status(500).send({
            success:false,
            message:"unable to promote todo/done"
        });
    }
    else{
        updateTaskState = req.body.taskState;
    }

    //Notes 
    //System generate notes
    taskNotes = taskResult[0].Task_notes;
    //System generate notes
    var today = new Date()
    var updateStateNotes = "UPDATED TASK STATE: " + req.body.taskState + " USER: " + req.body.un;
    if(req.body.taskPlan != taskResult[0].Task_plan){
        updateStateNotes.concat("|Update task plan: ", req.body.taskPlan);
    }
    var tempSystemNotes = "system|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + updateStateNotes;
    taskNotes += "||" + tempSystemNotes;

    //User add notes if exist 
    if(req.body.userNotes){
        var tempUserNotes = req.body.un + "|" + taskResult[0].Task_state + "|" + today.toISOString() + "|" + req.body.userNotes;
        taskNotes += "||" +tempUserNotes;

    }

    //Update task
    try{
        //send mail
        //1.get app
        if(updateTaskState ==="done"){
            const appResult = await ApplicationRepository.getAppByAcronym(taskResult[0].Task_app_Acronym);
            if(appResult[0].App_Acronym){
                //2. Get all users email based on App permit Done
                const allUsersEmail = await GroupRepository.getAllUserEmailByGroupName(appResult[0].App_permit_Done);
                console.log(allUsersEmail);
                //send email if not null
                for(const k in allUsersEmail){
                    if(allUsersEmail[k] !== null){
                        //Construct email subjct and body
                        //send email
                        let mailDetails = {
                            from: 'noreplytmsapp@gmail.com',
                            to: `${allUsersEmail[k].email}`,
                            subject: `Task name: ${taskResult[0].Task_name} review`,
                            text: `${req.body.un} pushed task id: ${taskResult[0].Task_id} to done state. Please review.`
                        };
                        try{
                            const sendMailResult = await nodemail(mailDetails);
                        }
                        catch(err){
                            console.log(err)
                        }
                        //clear mailDetails
                        mailDetails = null;
                    }
                }
            }
        }

        //console.log(taskNotes, taskResult[0].Task_plan, req.body.un, taskResult[0].Task_id, updateTaskState)
        const result = await TaskRepository.updateTask(taskNotes, taskResult[0].Task_plan, req.body.un, taskResult[0].Task_id, updateTaskState);
        if(result){
            return res.status(200).send({
                success:true,
                message:"task updated"
            })
        }
        return res.status(500).send({
            success:false,
            message:"error in updating task"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success:false,
            message:"error in updating task",
            err:err
        })
    }

});

//POST : PL update application || URL : /update/application || Checkgroup
//INPUT: acronym, description, endDate, permitCreate(optional), permitOpen(optional), permitTodo(optional), permitDoing(optional), permitDone(optional)
exports.plUpdateApp = CatchAsyncError(async(req,res,next)=>{
    //checkgroup


    //fields require to be change
    var newCreate, newOpen, newTodo, newDoing, newDone
    //Check if fields exist
    if(!req.body.acronym, !req.body.endDate){
        return res.status(500).send({
            success:false,
            message:"invalid inputs"
        });
    }
    const appResult = await ApplicationRepository.getAppByAcronym(req.body.acronym);
    if(!appResult[0].App_Acronym){
        return res.status(500).send({
            success:false,
            message:"acronym not found"
        });
    }
    //update endDate, check if endDate is not less than the startDate
    var startDate = appResult[0].App_startDate;
    var newEndDateArray = String(req.body.endDate).split("-");
    var newEndDate = new Date(parseInt(newEndDateArray[0]), parseInt(newEndDateArray[1]) - 1, parseInt(newEndDateArray[2])+1);
    if(startDate > newEndDate){
        return res.status(500).send({
            success:false,
            message:"End date invalid"
        });
    }

    //update app Permit Create
    if(req.body.permitCreate){
        //check if the group exist 
        const checkCreate = await GroupRepository.getGroupByGroupName(req.body.permitCreate);
        if(!checkCreate[0].groupName){
            return res.status(200).send({
                success:false,
                message:"invalid open group"
            });
        }
        newCreate = req.body.permitCreate;
    }else{
        newCreate = null;
    }

    //update app Permit open
    if(req.body.permitOpen){
        //check if the group exist 
        const checkOpen = await GroupRepository.getGroupByGroupName(req.body.permitOpen);
        if(!checkOpen[0].groupName){
            return res.status(200).send({
                success:false,
                message:"invalid open group"
            });
        }
        newOpen = req.body.permitOpen;
    }else{
        newOpen = null;
    }

    //update app Permit todo
    if(req.body.permitTodo){
        //check if the group exist 
        const checkTodo = await GroupRepository.getGroupByGroupName(req.body.permitTodo);
        if(!checkTodo[0].groupName){
            return res.status(200).send({
                success:false,
                message:"invalid todo group"
            });
        }
        newTodo = req.body.permitTodo;
    }else{
        newTodo = null;
    }

    //update app Permit doing
    if(req.body.permitDoing){
        //check if the group exist 
        const checkDoing = await GroupRepository.getGroupByGroupName(req.body.permitDoing);
        if(!checkDoing[0].groupName){
            return res.status(200).send({
                success:false,
                message:"invalid doing group"
            });
        }
        newDoing = req.body.permitDoing;
    }else{
        newDoing = null;
    }


    //update app Permit done
    if(req.body.permitDone){
        //check if the group exist 
        const checkDone = await GroupRepository.getGroupByGroupName(req.body.permitDone);
        if(!checkDone[0].groupName){
            return res.status(200).send({
                success:false,
                message:"invalid done group"
            });
        }
        newDone = req.body.permitDone;
    }else{
        newDone = null;
    }

    //update application
    try{
        const result = await ApplicationRepository.updateApp(newEndDate, newCreate, newOpen, newTodo, newDoing, newDone, appResult[0].App_Acronym, req.body.description);
        if(result){
            return res.status(200).send({
                success:true,
                message:"application updated"
            }); 
        }

        return res.status(200).send({
            success:false,
            message:"error in updating application"
        });

    }catch(err){
        console.log(err);
        return res.status(200).send({
            success:false,
            message:"error in updating application",
            err: err
        });
    }
});


