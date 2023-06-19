//Import User entity
const User = require('../entity/user_model');


function userValidation(User){
    for(const key in Student){
        if(Student[key] === undefined){
            return false;
        }
    }
    return true;
}


module.exports = {
    "userValidation" : userValidation,
}