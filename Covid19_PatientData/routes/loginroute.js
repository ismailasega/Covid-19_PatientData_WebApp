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
            const accessToken  = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
            refreshTokens.push(refreshToken);
            res.redirect('/patientData');
        }else if (user.password != passWord){
            req.flash('status2', 'Invalid Password');
            res.redirect('/login');
        }
    }catch(err){
        req.flash('status2', 'Invalid Username');
        res.redirect('/login');
    }
});

router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});

//logout
router.get('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.redirect("/login");
});


module.exports = router;