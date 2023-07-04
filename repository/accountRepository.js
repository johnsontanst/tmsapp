//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_account_query,
    get_account_by_email_query,
    get_account_by_username_query,
    get_all_users_group_query,
    update_account_emailPassword_query,
    admin_update_user_account_query,
    get_all_users_query,
    create_account_without_email_query
    } = require('./dbQueries');


class accountRepository{

    static newAccount(username, password, email, status){
        return new Promise((resolve, reject)=>{
            conn.execute(create_account_query, [username, password, email, status], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        })
    }
    
    static newAccountWithoutEmail(username, password, status){
        return new Promise((resolve, reject)=>{
            conn.execute(create_account_without_email_query, [username, password, status], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        })
    }

    static getAccountByUsername(username){
        return new Promise((resolve, reject)=>{
            conn.execute(get_account_by_username_query, [username], (err,data)=>{
                if(err) reject(err);
                resolve(data);
            });
        }); 
    }

    static getAccountByEmail(email){
        return new Promise((resolve,reject)=>{
            conn.execute(get_account_by_email_query, [email], (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        });
    }

    static getAllUsersWithGroups(){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_users_group_query, (err, data)=>{
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static getAllUsers(){
        return new Promise((resolve, reject)=>{
            conn.execute(get_all_users_query, (err, data)=>{
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static updateUserEmailPassword(email, password, username){
        return new Promise((resolve, reject)=>{
            conn.execute(update_account_emailPassword_query, [password, email, username], (err)=>{
                if(err) reject(err);
                resolve(true);
            })
        })
    }

    static adminUpdateEmailPasswordStatus(email, password, username, status){
        return new Promise((resolve, reject)=>{
            conn.execute(admin_update_user_account_query, [password, email, status, username], (err)=>{
                if(err) reject(err);
                resolve(true);
            });
        })
    }

}

module.exports = accountRepository;
