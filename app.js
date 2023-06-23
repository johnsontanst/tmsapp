//Import express and CORS
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors(
    {
        origin: 'http://localhost:3030',
        optionsSuccessStatus: 200,
        credentials:true
    }
));
//Cookie Parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//env variables 
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'}); 

//Import routes 
const newRoutes = require('./routes/routes');

//Import express-session & cookie-parser
const expressSession = require('express-session');
app.use(expressSession({secret:process.env.COOKIE_SECRET_KEY, resave:false, saveUninitialized:false, cookie:{
    httpOnly:true,
    maxAge:parseInt(process.env.COOKIE_EXPIRES_IN) * 60 * 1000 //2 hrs 
}}));

//use express json for req body 
app.use(express.json());

//Routing
app.use(newRoutes);
app.get('/welcome', (req, res, next)=>{
    res.status(200).json({
        success:true,
        message:"Welcome"
    });
});

//Import middleware error 
const errorMiddleware = require('./middleware/error');
app.use(errorMiddleware);
  

//Listening to port
app.listen(process.env.PORT, ()=>{
    console.log(`Server started at port: ${process.env.PORT}`);
});