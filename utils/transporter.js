const transporter = require("nodemailer")
//env variables 
const dotenv = require('dotenv');
dotenv.config({path: "../config/config.env"}); 

exports.nodemail = async (mailOptions)=>{
  let gmailCreds = transporter.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });
    //Send mail
    console.log(process.env.GMAIL_USER);
    console.log(process.env.GMAIL_PASSWORD)
    gmailCreds.sendMail(mailOptions, (err, data)=>{
        if(err){
          console.log("nodemail", err);
          return err 
        }else{
          return true
        }
    })
};