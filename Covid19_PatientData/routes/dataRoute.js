const express = require('express');
const router = express.Router();

const PatientData = require('../models/PatientData')


router.get('/RegisterPatient', (req, res)=>{
    res.render('CovidForm_page', {status:'', status2:''});
});

// router.get('/patientData', (req, res)=>{
//     res.render('PatientData_page', {status:'', status2:''});
// });

router.post('/RegData', async(req, res)=>{
    try{
        const patientsData = new PatientData(req.body);
        await patientsData.save();
        req.flash('status', 'Patient Data Added Succesfully');
        res.redirect('/patientData');
    }catch(err){
        res.render('PatientData_page', {status2:'Patient Data not Added'});
    }
})

router.get('/patientData', async(req, res)=>{
    // if(req.session.user){
        try{
        const patients = await PatientData.find();
        res.render('PatientData_page',{patients: patients, status: req.flash('status'), status2: req.flash('status2')});
        }catch(err){
            res.render('RegStudent_page', {status2:'Failed to retrive student details'});
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
            res.redirect('back');
        }catch(err){
            res.status(400).send("unable to delete patient data")
        }
    // }else{
    //     res.redirect('/login');
    // }
});

module.exports = router;