//Requiring dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

//Declearing routes
const data =require('./routes/dataRoute');

//Initilising app
const app =express();

//MongoDB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
  });

mongoose.connection
.on('open', () => {
console.log('Mongoose connection open');
})
.on('error', (err) => {
console.log(`Connection error: ${err.message}`);
});

//Middleware to be able to use form data
app.use(bodyParser.urlencoded({extended: true}));

//Tellin the App to use folders and files within the public folder 
app.use(express.static('public'));

//Path
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Telling App to use routes delcared in the routes folder 
app.use('/', data);

//Handling non-existant route / path
app.get('*', (req,res)=>{
    res.send('404! Invalid Request')
  });

//Creating a server and listening port 3000
app.listen(5000, ()=> console.log('listening on port 5000'));