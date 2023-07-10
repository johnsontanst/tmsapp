//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_application_query,
    get_all_application_query,
    get_app_by_app_acronym_query,
    update_app_Rnumber_query,
    update_app_query,
    check_create_group_query,
    check_open_group_query,
    check_todo_group_query,
    check_doing_group_query,
    check_done_group_query
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

    static updateApp(endDate, permitOpen, permitTodo, permitDoing, permitDone, acronym, desc){
        return new Promise((resolve, reject)=>{
            conn.execute(update_app_query, [endDate, permitOpen, permitTodo, permitDoing, permitDone, desc, acronym], (err)=>{
                if(err) reject(err);
                resolve(true);
            });
        })
    }

    static checkGroupInPermitCreate(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_create_group_query, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static checkGroupInPermitOpen(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_open_group_query, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static checkGroupInPermitTodo(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_todo_group_query, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static checkGroupInPermitDoing(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_doing_group_query, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static checkGroupInPermitDone(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_done_group_query, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }



}


module.exports = applicationRepository;