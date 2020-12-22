const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

//Declaring users
const Users = require('../models/Users');

//Tokens
const accessTokenSecret = 'myaccess-secret';

//Getting Login in page
router.get('/login', (req, res)=>{
    res.render('login_page', {status: req.flash('status'), status2: req.flash('status2')});
});


//Authenticating login
router.post('/login', async(req, res) => {
    try{
        const userName = req.body.username;
        const passWord = req.body.password;

        // filter user from the users collection by username
        const user = await Users.findOne({username: userName});
        const isMatch = bcrypt.compareSync(passWord, user.password);
        if (isMatch) {
            // generate an access token sending it as a cookie
            const accessToken = jwt.sign({ _id: user.id, username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '5m' });
            res.cookie('authtoken', accessToken, {maxAge:900000, httpOnly: true})
            res.redirect('/RegisterPatient');

        }else if (user.password != passWord){
            req.flash('status2', 'Invalid password, please try again');
            res.redirect('/login');
        }
    }catch(err){
        req.flash('status2', 'Invalid username, please try again');
        res.redirect('/login');
    }
})

//Login access token verification 
function authenticateJWT (req, res, next) {
    try{
        const token = req.cookies.authtoken
        console.log(token)
        if(!token){
            req.flash('status2', 'Access Denied');
            res.redirect('/login');
            return
        }
        else if (token) {
            jwt.verify(token , accessTokenSecret, (err, user) => {
                if (err) {
                    req.flash('status2', 'Forbidden. Please enter credentials to proceed');
                    res.redirect("/login");
                }
                req.user = user;
                next();
                
        })
    }
    }catch (err) {
        req.flash('status2', 'Unauthorized, Please enter credentials to proceed');
        res.redirect("/login");
    }
}

//Patient registartion
router.get('/RegisterPatient', authenticateJWT, (req, res)=>{
        res.render('CovidForm_page'); 
});


//logout
router.get('/logout', function(req, res){
    cookie = req.cookies;
    for (var x in cookie) {
        if (!cookie.hasOwnProperty(x)) {
            continue;
        }    
        res.cookie(x, '', {expires: new Date(0)});
    }
    res.redirect('/login');
});

module.exports = {authenticateJWT}
module.exports = router