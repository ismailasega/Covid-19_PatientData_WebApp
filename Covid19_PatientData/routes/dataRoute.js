const express = require('express');
const router = express.Router();

const PatientData = require('../models/PatientData');
const Users = require('../models/Users');


router.get('/RegisterPatient', (req, res)=>{
    res.render('CovidForm_page', {status:'', status2:''});
});

//Creating user credentials
router.post('/user', async(req,res)=>{
        try{
            const user = new Users(req.body);
            await Users.register(user, req.body.password, (err)=>{
                if (err){
                    throw err
                }
                res.redirect('/login')
            })
        }catch(err){
            res.status(400).send("Failed to add user");
        }
});
  
router.post('/RegData', async(req, res)=>{
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

router.get('/patientData', async(req, res)=>{
    // if(req.session.user){
        try{
        const patients = await PatientData.find();
        res.render('PatientData_page',{patients: patients, status: req.flash('status'), status2: req.flash('status2')});
        }catch(err){
            req.flash('status2', 'unable to retrive patient data');
            res.redirect('back');
        }
    // }else{
    //     res.redirect('/login');
    // }
});

//Deleting Patient Data
router.post('/deletePatient', async(req, res)=>{
    // if(req.session.user){
        try{
            await PatientData.deleteOne({_id: req.body.id});
            req.flash('status', 'Patient Data Deleted Succesfully');
            res.redirect('back');
        }catch(err){
            req.flash('status2', 'unable to delete patient data');
            res.redirect('back');
        }
    // }else{
    //     res.redirect('/login');
    // }
});

module.exports = router;