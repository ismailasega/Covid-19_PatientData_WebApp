const express = require('express');
const router = express.Router();

//hashing password
const bcrypt = require('bcrypt');

const PatientData = require('../models/PatientData');
const Users = require('../models/Users');

const accessTokenSecret = require('../routes/loginroute')

//Login access token verification  
function authenticateJWT (req, res, next) {
    try{
        const token = req.header('Cookie')
        console.log(token)
        if(!token){
            req.flash('status2', 'Access Denied');
            res.redirect('/login');
            return
        }
        else if (token) {
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    req.flash('status2', 'Forbidden. Please enter credentials to proceed');
                    res.redirect("/login");
                    return
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


//Creating Admin User credentials
router.post('/user', async(req, res)=>{
        try{
            const user = new Users(req.body);
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role='admin'
            await user.save();
                req.flash('status', 'User credentials created successfully, you can now login');
                res.redirect('/login')
        }catch(err){
            req.flash('status2', 'Failed to create user credentials');
            res.redirect("/login");
        }
});
  
router.post('/RegData', authenticateJWT, async(req, res)=>{
    try{
        const patientsData = new PatientData(req.body);
        await patientsData.save();
        req.flash('status', 'Patient Data Added Succesfully');
        res.redirect('/patientData');
    }catch(err){
        req.flash('status2', 'Patient Data Not Added');
        res.redirect('/patientData');
    }
})

router.get('/patientData', authenticateJWT, async(req, res)=>{
        try{
        const patients = await PatientData.find();
        res.render('PatientData_page',{patients: patients, status: req.flash('status'), status2: req.flash('status2')});
        }catch(err){
            req.flash('status2', 'unable to retrive patient data');
            res.redirect('back');
        }
});

//Deleting Patient Data
router.post('/deletePatient', authenticateJWT, async(req, res)=>{
        try{
            await PatientData.deleteOne({_id: req.body.id});
            req.flash('status', 'Patient Data Deleted Succesfully');
            res.redirect('back');
        }catch(err){
            req.flash('status2', 'unable to delete patient data');
            res.redirect('back');
        }
});

module.exports = router;