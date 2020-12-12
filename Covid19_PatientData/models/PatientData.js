const { builtinModules } = require('module');
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

    patient:String,
    surname:String,
    givenName:String,
    dob:String,
    phone:Number,
    IdCard:String,
    residence:String,
    occupation:String,
    nationality:String,
    gender:String,
    category:String
},{timestamps: true,});

module.exports = mongoose.model('PatientData', patientSchema)