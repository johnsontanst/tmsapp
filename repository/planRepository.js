//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_plan_query,
    get_all_plan_by_app_query,
} = require('./dbQueries');


class planRepository{

    static createPlan(planName, startDate, endDate, appAcronym, colour){
        return new Promise((resolve, reject)=>{
            conn.execute(create_plan_query, [planName, startDate, endDate, appAcronym, colour], (err)=>{
                if(err) return err;
                resolve(true);
            })
        });
    }

    static getAllPlanByApp(acronym){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_plan_by_app_query, [acronym], (err,data)=>{
                if(err) return err;
                resolve(data);
            })
        });
    }

}


module.exports = planRepository;