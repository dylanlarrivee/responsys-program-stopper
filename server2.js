const rp = require('request-promise');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./util/database')
const responsysApi = require('./controllers/responsysApi')
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true })); 

// ROUTES

// This will pull in all the auth routes we have set up in other files.
//app.use(authRoutes);

app.post('/suppTables', db.createSupp)

app.post('/suppTablesRefresh', function(req, res) {
    responsysApi.authTokenPrograms(responsysApi.authOptions,rp, responsysApi.responsys, res);
    console.log(req);
    
});

app.post('/stopProgram', function(req, res) {
    console.log("Name of program to stop" + req.body.programName)
    
});

app.get('/programsInfo', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.html'), {allPrograms: 'responsys.programs'});
    //res.json({allPrograms: responsys.programs});
    //res.send("Auth token request received:" + authToken );
    res.send(responsys.programs);
    console.log('get at /programsInfo')
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'), {allPrograms: 'responsys.programs'});
    //res.json({title:"api",message:"root"});
    //res.send("Auth token request received:" + authToken );
    //res.send(authCon.auth);
});

// This pulls in static css and image files from the public folder
app.use(express.static(path.join(__dirname, '/public')));

app.get('/programs', function(req, res) {
    res.send("Programs are: " + 'responsys.programs');
    //res.send(authCon.auth);
});


 app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    res.send("Return quote with the ID: " + req.params.id);
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    res.json(req.body);
});

app.listen(3000, function(){
    console.log('Listening on Port 3000');
});