//Import Bcrypt
const bcrypt = require('bcrypt');

//Import env variables
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'}); 

//Password encryption
exports.passwordEncryption = async (password)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), function(err, hash){
            if(err) throw err;
            resolve(hash);
        });
    });
};


exports.passwordValidation = async (plainPassword, hashedPassword)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(plainPassword, hashedPassword, (err, result)=>{
            if(err) throw err;

            if(result){
                resolve(true);
            }
            else{
                resolve(false);
            }
        })
    })
};