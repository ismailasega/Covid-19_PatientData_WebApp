const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//hashing password
const bcrypt = require('bcrypt');

const PatientData = require('../models/PatientData');
const Users = require('../models/Users');

//secret
const accessTokenSecret = 'myaccess-secret';

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

//Creating Admin User credentials
router.post('/admin', async(req, res)=>{
        try{
            const user = new Users(req.body);
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role='admin'
            await user.save();
                req.flash('status', 'Admin credentials created successfully, you can now login');
                res.redirect('/login')
        }catch(err){
            req.flash('status2', 'Failed to create admin credentials');
            res.redirect("/login");
        }
});

//Add User
router.get('/AddUser', authenticateJWT, (req, res)=>{
    const { role } = req.user
    if(role !== 'admin'){
        req.flash('status2', 'Not Authorized to Add Users');
        res.redirect('back');

    }else if (role === 'admin'){
    res.render('AddUsers_page', {status: req.flash('status'), status2: req.flash('status2')});
    } 
});

//Creating User credentials
router.post('/user', authenticateJWT, async(req, res)=>{
    try{
        const user = new Users(req.body);
        user.password = bcrypt.hashSync(req.body.password, 10);
        await user.save();
            req.flash('status', 'User credentials created successfully');
            res.redirect('/AddUser')
    }catch(err){
        req.flash('status2', 'Failed to create user credentials');
        res.redirect("/AddUser");
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

//Update FarmerOne Data
router.post('/editPatient', authenticateJWT, async(req, res)=>{
    const { role } = req.user
    if(role !== 'admin'){
        req.flash('status2', 'Not Authorized to delete Patient Data');
        res.redirect('back');

    }else if (role === 'admin'){
    try{
      await FarmerOne.findOneAndUpdate({_id: req.query.id}, req.body)
      req.flash('status', 'Patient data updated succesfully')
      res.redirect('back');
    }catch(err){
      req.flash('staus2', 'unable to update patient data, please try again!')
      res.redirect('back')
    }
    }
})
  
//Deleting Patient Data
router.post('/deletePatient', authenticateJWT, async(req, res)=>{
    const { role } = req.user
    if(role !== 'admin'){
        req.flash('status2', 'Not Authorized to delete Patient Data');
        res.redirect('back');

    }else if (role === 'admin'){
        try{
            await PatientData.deleteOne({_id: req.body.id});
            req.flash('status', 'Patient Data Deleted Succesfully');
            res.redirect('back');
        }catch(err){
            req.flash('status2', 'unable to delete patient data');
            res.redirect('back');
        }
    }
});

module.exports = router;