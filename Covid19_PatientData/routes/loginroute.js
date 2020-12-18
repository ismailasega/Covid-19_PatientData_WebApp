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
            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '1m' });
            jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
            res.header('auth-token', accessToken)
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

const authenticateJWT = (req, res, next) => {
    const token = req.header('auth-token')
    console.log(token)
    if(!token)
        req.flash('status2', 'Access Denied');
        res.redirect('/login')
    try{
        if (token) {
            token = token.split(' ')[1];
            jwt.verify(token, accessTokenSecret, (err, verified) => {
                if (err) {
                    req.flash('status2', 'Forbidden. Please enter credentials to proceed');
                    res.redirect("/login");
                }
            req.user = verified;
            next();
        })
    }
    }catch (err) {
        req.flash('status2', 'Unauthorized, Please enter credentials to proceed');
        res.redirect("/login");
    }
}

router.get('/RegisterPatient', authenticateJWT, (req, res, next)=>{
    res.render('CovidForm_page'); 
});

//logout
router.get('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.redirect("/login");
});


module.exports = router;