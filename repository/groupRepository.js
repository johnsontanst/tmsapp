//Import db connection
const {conn} = require('./dbConnection');

//Import datetime
const {datetimeToMysql} = require('../utils/datetime')

//Import queries
const {
    create_group_query,
    get_group_by_groupName,
    add_user_into_group_query,
    get_all_group_by_username_query,
    delete_all_groups_by_username_query,
    get_all_groups_query,
    check_user_in_group_query,
    } = require('./dbQueries');


class groupRepository{

    static newGroup(groupName){
        return new Promise(async (resolve, reject)=>{
            conn.execute(create_group_query, [groupName], (err)=>{
                if (err) reject(err);
                resolve(true);
            })
        })
    };

    static addAccountToGroup(username, groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(add_user_into_group_query, [username, groupName], (err)=>{
                if (err) reject(err);
                resolve(true);
            })
        });
    }

    static getGroupByGroupName(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(get_group_by_groupName, [groupName], (err, data)=>{
                if(err) reject(false);
                resolve(data);
            })
        })
    }
    
    static getAllGroupNameByUsername(username){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_group_by_username_query, [username], (err,data)=>{
                if(err) reject(false);
                resolve(data);
            })
        });
    }

    static getAllAccountsByGroupId(accGroupId){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_account_by_group_id_query, [accGroupId], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        })
    }

    static deleteAllGroupsByUsername(username){
        return new Promise((resolve, reject)=>{
            conn.execute(delete_all_groups_by_username_query, [username], (err)=>{
                if(err) reject(err);
                resolve(true);
            });
        }); 
    }

    static getAllGroups(){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_groups_query, (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        });
    }

    static checkUserGroup(username, groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(check_user_in_group_query, [groupName, username], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            })
        });
    }
}

module.exports = groupRepository;
