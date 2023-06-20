//Import db connection
const {conn} = require('./dbConnection');

//Import queries
const {
    create_account_query,
    get_account_by_email_query,
    get_account_by_username_query,
    get_account_by_id_query,
    } = require('./dbQueries');

//Import entities
const User = require('../entity/user_model');

//Validation
const {userValidation} = require('../utils/userValidation');

class accountRepository{
    constructor(User){
        this.User = User;
    }

    static newAccount(username, password, email){
        return new Promise((resolve, reject)=>{
            conn.execute(create_account_query, [username, password, email], (err)=>{
                if(err) reject(err);
                const user = new User(username, email);
                resolve(user);
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
                if(err) throw err;
                resolve(data);
            });
        });
    }

    static getAccountById(accountId){
        return new Promise((resolve, reject)=>{
            conn.execute(get_account_by_id_query, [accountId], (err, data)=>{
                if(err) throw err;
                resolve(data);
            })
        })
    }
}

module.exports = accountRepository;
