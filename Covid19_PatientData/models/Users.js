const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username:String,
    password:String,
    role:String,
    token:String,

});

module.exports = mongoose.model('Users', userSchema)