//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_plan_query,
    get_all_plan_by_app_query,
    get_plan_by_plan_name_query,
    get_plan_by_planName_app_query,
} = require('./dbQueries');


class planRepository{

    static createPlan(planName, startDate, endDate, appAcronym, colour){
        return new Promise((resolve, reject)=>{
            conn.execute(create_plan_query, [planName, startDate, endDate, appAcronym, colour], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        });
    }

    static getAllPlanByApp(acronym){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_plan_by_app_query, [acronym], (err,data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

    static getPlanByPlanName(planName){
        return new Promise((resolve, reject)=>{
            conn.execute(get_plan_by_plan_name_query, [planName], (err,data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

    static getPlanByPlanNameNApp(planName, app){
        return new Promise((resolve, reject)=>{
            conn.execute(get_plan_by_planName_app_query, [planName, app], (err,data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }

}


module.exports = planRepository;