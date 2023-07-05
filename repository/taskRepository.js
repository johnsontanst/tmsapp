//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_task_query,
    get_task_by_app_query,
    get_task_by_plan_query,
    get_task_by_task_name_query,
    update_task_query,
    update_task_state_query
} = require('./dbQueries');


class planRepository{

    static createTask(taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator, taskOwner, startDate){
        return new Promise((resolve, reject)=>{
            conn.execute(create_task_query, [taskName, taskDescription, taskNotes, taskId, taskPlan, taskApp, taskState, taskCreator,taskOwner, startDate], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        });
    }

    static getTaskByApp(acronym){
        return new Promise((resolve, reject)=>{
            conn.execute(get_task_by_app_query, [acronym], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

    static getTaskByPlan(planName){
        return new Promise((resolve, reject)=>{
            conn.execute(get_task_by_plan_query, [planName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

    static getTaskByTaskName(taskName){
        return new Promise((resolve, reject)=>{
            conn.execute(get_task_by_task_name_query, [taskName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

    static updateTask(taskNotes, taskPlan, taskOwner, taskId, taskState){
        return new Promise((resolve, reject)=>{
            conn.execute(update_task_query, [taskState, taskNotes, taskPlan, taskOwner, taskId], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        });
    }

    static updateTaskState(taskState){
        return new Promise((resolve, reject)=>{
            conn.execute(update_task_state_query, [taskState], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        });
    }   

}


module.exports = planRepository;