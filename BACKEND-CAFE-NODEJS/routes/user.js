const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const nodemailer = require('nodemailer');

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//----------------------signup API-------------------------------
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {

        if (!err) {
            if (results.length <= 0) {    //user is available with this email or not we check 
                /*if the status is "true" then user is able to login and "false" then user is not able
                ? means user enter those value take*/
                query = "insert into user(name,contactNumber,email,password,status,role) value(?,?,?,?,'true','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully registered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Email Already Exist" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//------------------------Login API---------------------------------
router.post('/login', (req, res) => {
    const user = req.body;   //enter data by user
    query = "select email,password,role,status from user where email=?";

    connection.query(query, [user.email], (err, results) => {  //results is from data base
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or Password" });
            }
            else if (results[0].status === "false") {    //we check that user having status is true or not
                return res.status(401).json({ message: "Wait for Admin Approval" });
            }
            else if (results[0].password == user.password) {  //we generate token
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong.Please try again later" });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

//-----------node mailer-----------------
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.google.email',
    // host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

//--------------Forgot Password------------------
router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select email,password from user where email=?";

    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {  //user does not exists in database

                //here we cannot saw error like email id is invalid because any one can check that particular email id exists or not
                return res.status(200).json({ message: "Password sent successfully to your email" });
            }
            else { //we sending mail
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,        //enter by user
                    subject: 'Password by cafe Management System',
                    html: '<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="https://cafe-management-system.onrender.com/">Click Here To Login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email Sent:' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent successfully to your email" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//--------Get All User API---------------
router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//----------Change the status of user API-----------
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            //we check that row affected or not
            //this is not affected
            if (results.affectedRows == 0) {
                return res.status(404).json({ "message": "User Id does not exist" });
            }
            return res.status(200).json({ "message": "User Updated Successfully" });  //when row change
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//------------------------------check token API-----------------------------
router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ "message": "true" })
})

//--------------------------change Password API-------------------------------
router.post('/changePassword',auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;  //this is got from authenticateToken
    var query = "select * from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {  //when old password is not in the database
                return res.status(400).json({ message: "Incorrect Old password" });
            } else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ "message": "Password Updated Successfully" });
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ "message": "Something Went Wrong. please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;

