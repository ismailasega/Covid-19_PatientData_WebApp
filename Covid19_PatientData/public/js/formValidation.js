//Delclaring form fieldnames
const Pname = document.covid19Data.surname;
const Gname = document.covid19Data.givenName;
const dOB = document.covid19Data.dob;
const reside = document.covid19Data.residence;
const ocpt = document.covid19Data.occupation;
const country = document.covid19Data.nationality;
const GenDer = document.covid19Data.gender;
const categ = document.covid19Data.category;


//Displaying data
const surname_error = document.getElementById('name');
const gname_error = document.getElementById('gName');
const dob_error = document.getElementById('DOB');
const res_error = document.getElementById('Presidence');
const oct_error = document.getElementById('occupt');
const origin_error = document.getElementById('nation');
const gen_error = document.getElementById('gen')
const cat_error = document.getElementById('cat')


//Listeners
Pname.addEventListener("blur", PnameVerify, true);
Gname.addEventListener("blur", GnameVerify, true);
dOB.addEventListener("blur", dobVerify, true);
reside.addEventListener("blur", resVerify, true);
ocpt.addEventListener("blur", occptVerify, true);
country.addEventListener("blur", originVerify, true);
categ.addEventListener("blur", catVerify, true);


function validate(){

    if(Pname.value == ""){
        Pname.style.border = "1px solid red";
        surname_error.textContent = "Please enter a Surname"
        Pname.focus()
        return false
    }
    if(Gname.value == ""){
        Gname.style.border = "1px solid red";
        gname_error.textContent = "Please enter the Given Name"
        Gname.focus()
        return false
    }
    if(dOB.value == ""){
        dOB.style.border = "1px solid red";
        dob_error.textContent = "Please select a Date of Birth"
        dOB.focus()
        return false
    }
    if(reside.value == ""){
        reside.style.border = "1px solid red";
        res_error.textContent = "Please enter a Residence"
        reside.focus()
        return false
    }
    if(ocpt.value == ""){
        ocpt.style.border = "1px solid red";
        oct_error.textContent = "Please enter an Occupation"
        ocpt.focus()
        return false
    }
    if(country.value == ""){
        country.style.border = "1px solid red";
        origin_error.textContent = "Please enter Nationality"
        country.focus()
        return false
    }

    if (GenDer[0].checked != true &&
        GenDer[1].checked != true){
        gen_error.textContent = "Please select a gender";
        return false;
    }else{
        gen_error.innerHTML ="";
    }
    
    if(categ.value == "Default"){
        categ.style.border = "1px solid red";
        cat_error.textContent = "Please select a Category"
        categ.focus()
        return false
    }
    
}

//Event Handlers
function PnameVerify(){
    const nameRegex =  /^\w{1,16}[a-zA-Z]+$/;
    if(Pname.value != "" && Pname.value.match(nameRegex)){
        Pname.style.border = "1px solid green";
        surname_error.innerHTML ="";
        return true;
    }else{
        Pname.style.border = "1px solid red";
        surname_error.textContent = "Surname Should be between 1 to 16 and only alphabets";   
    }
}

function GnameVerify(){
    const nameRegex =  /^\w{1,16}[a-zA-Z]+$/;
    if(Gname.value != "" && Gname.value.match(nameRegex)){
        Gname.style.border = "1px solid green";
        gname_error.innerHTML ="";
        return true;
    }else{
        Gname.style.border = "1px solid red";
        gname_error.textContent = "Given name Should be between 1 to 16 and only alphabets";   
    }
}

function dobVerify(){
    if(dOB.value != ""){
        dOB.style.border = "1px solid green";
        dob_error.innerHTML ="";
        return true;
    }
}

function resVerify(){
    const AddRegex =  /^\w{1,20}[a-zA-Z]+$/;
    if(reside.value != "" && reside.value.match(AddRegex)){
        reside.style.border = "1px solid green";
        res_error.innerHTML ="";
        return true;
    }else{
        reside.style.border = "1px solid red";
        res_error.textContent = "Residence Should be between 1 to 20 and only alphabets";   
    }
}

function occptVerify(){
    const OccuptRegex =  /^\w{5,50}[a-zA-Z]+$/;
    if(ocpt.value != "" && ocpt.value.match(OccuptRegex)){
        ocpt.style.border = "1px solid green";
        oct_error.innerHTML ="";
        return true;
    }else{
        ocpt.style.border = "1px solid red";
        oct_error.textContent = "Occupation Should be between 5 to 50 and only alphabets";   
    }
}

function originVerify(){
    const NationRegex =  /^\w{5,20}[a-zA-Z]+$/;
    if(country.value != "" && country.value.match(NationRegex)){
        country.style.border = "1px solid green";
        origin_error.innerHTML ="";
        return true;
    }else{
        country.style.border = "1px solid red";
        origin_error.textContent = "Nationality Should be between 5 to 20 and only alphabets";   
    }
}
function catVerify(){
    if(categ.value != "Default"){
        categ.style.border = "1px solid green";
        cat_error.innerHTML ="";
        return true;
    }
}