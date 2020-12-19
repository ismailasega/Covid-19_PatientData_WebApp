const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

//Declaring users
const Users = require('../models/Users');

//Tokens
const accessTokenSecret = 'myaccess-secret';
const refreshTokenSecret = 'myrefresh-secret';
const refreshTokens = [];

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
            // generate an access token
            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '24m' });
            jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
            res.header('Authorization', accessToken)
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

function authenticateJWT (req, res, next) {
    try{
        const token = req.header('Cookie')
        console.log(token)
        if(!token)
        return req.flash('status2', 'Access Denied').redirect('/login');
    
        if (token) {
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    req.flash('status2', 'Forbidden. Please enter credentials to proceed');
                    res.redirect("/login");
                    return;
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

router.get('/RegisterPatient', authenticateJWT, (req, res)=>{
    res.render('CovidForm_page'); 
});


//logout
router.get('/logout', (req, res) => {
    const { token } = req.header('cookie');
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.redirect("/login");
});


module.exports = router;