const express = require('express');
const router = express.Router();

const PatientData = require('../models/PatientData')


router.get('/patientData', (req, res)=>{
    res.render('CovidForm_page', {status:'', status2:''});
});

router.post('/RegData', async(req, res)=>{
    try{
        const patientsData = new PatientData(req.body);
        await patientsData.save();
        res.render('CovidForm_page', {status:'Patient Data Added Successfully'});
    }catch(err){
        res.render('CovidForm_page', {status2:'Patient Data not Added'});
    }
})

module.exports = router;