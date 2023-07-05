//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_application_query,
    get_all_application_query,
    get_app_by_app_acronym_query,
    update_app_Rnumber_query,
} = require('./dbQueries');


class applicationRepository{

    static createApplication(acronym, description, rnumber, startDate, endDate, open, toDoList, doing, done){
        return new Promise((resolve, reject)=>{
            conn.execute(create_application_query, [acronym, description, rnumber,startDate,endDate,open,toDoList,doing,done], (err)=>{
                if(err) reject(err);
                resolve(true);
            });
        });
    }

    static getAllApplication(){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_application_query, [], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static getAppByAcronym(acronym){
        return new Promise((resolve, reject)=>{
            conn.execute(get_app_by_app_acronym_query, [acronym], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static updateRnumber(acronym, rNumber){
        return new Promise((resolve, reject)=>{
            conn.execute(update_app_Rnumber_query, [rNumber, acronym], (err)=>{
                if(err) reject(err);
                resolve(true);
            });
        })
    }



}


module.exports = applicationRepository;