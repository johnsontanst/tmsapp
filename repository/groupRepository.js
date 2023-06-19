//Import db connection
const {conn} = require('./dbConnection');

//Import datetime
const {datetimeToMysql} = require('../utils/datetime')

//Import queries
const {
    create_group_query,
    get_group_by_groupName,
    add_user_into_group_query,
    get_all_group_by_account_id_query,
    get_all_account_by_group_id_query,
    } = require('./dbQueries');

//Validation
const {userValidation} = require('../utils/userValidation');

class groupRepository{



    static newGroup(groupName){
        return new Promise(async (resolve, reject)=>{
            conn.execute(create_group_query, [groupName, await datetimeToMysql()], (err)=>{
                if (err) reject(err);
                resolve(true);
            })
        })
    };

    static addAccountToGroup(accountId, groupId){
        return new Promise((resolve, reject)=>{
            conn.execute(add_user_into_group_query, [accountId, groupId], (err)=>{
                if (err) reject(err);
                resolve(true);
            })
        });
    }

    static getGroupByGroupName(groupName){
        return new Promise((resolve, reject)=>{
            conn.execute(get_group_by_groupName, [groupName], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            })
        })
    }

    static getAllGroupNameByAccountId(accountId){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_group_by_account_id_query, [accountId], (err,data)=>{
                if(err) reject(err);
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
}

module.exports = groupRepository;
