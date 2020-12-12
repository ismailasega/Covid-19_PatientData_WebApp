const express = require('express');
const router = express.Router();

// const PatientData = require('../models/PatientData')


router.get('/login', (req, res)=>{
    res.render('login_page');
});

module.exports = router;