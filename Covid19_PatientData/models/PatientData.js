const { builtinModules } = require('module');
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

    surname:String,
    givenName:String,
    dob:String,
    residence:String,
    occupation:String,
    nationality:String,
    gender:String,
    category:String
});

module.exports = mongoose.model('PatientData', patientSchema)