const mysql = require('mysql2')

//export conn 
 exports.conn = mysql.createPool({
    host:'localhost',
    user: 'root',
    password : 'password',
    database : 'nodelogin',
    connectionLimit: 10,
    maxIdle : 10,
    idleTimeout : 50000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    queueLimit: 0,
});
