var async = require('async'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    express = require('express'),
    mysql = require('mysql');

var app = express();
app.use(bodyParser());

// MySQL
// var Pactual = mysql.createConnection({
//   host: '189.3.44.196',
//   port: '3306',
//   user: 'root',
//   password: '',
//   database: 'pactual'
// });

var Pactual = mysql.createConnection({
  host: 'web.voxpopuli.com.br',
  port: '3306',
  user: 'alex',
  password: 'etropusvox',
  database: 'voxpopuli'
});

var Orion = mysql.createConnection({
  host: 'orion.voxdobrasil.com',
  port: '3306',
  user: 'alex',
  password: 'etropusvox',
  database: 'orion'
});

// Connect
// Pactual.connect(function(err) { console.log('Pactual - id ' + Pactual.threadId); });
// Orion.connect(function(err) { console.log('Orion - id ' + Orion.threadId); });

// MongoDB
mongoose.connect('mongodb://orion:sdfwer@192.34.56.106:27017/orion', function() {
  console.log( "Conection with orion started" );
});

var models_path = __dirname + '/models';
var model_files = fs.readdirSync(models_path);

model_files.forEach(function(file) {
  require(models_path + '/' + file);
});

var Dashboard     = mongoose.model('Dashboard'),
    Element       = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report        = mongoose.model('Report'),
    Variable      = mongoose.model('Variable');

var dashboards     = require('./resources/dashboards'),
    elements       = require('./resources/elements'),
    questionnaires = require('./resources/questionnaires'),
    reports        = require('./resources/reports'),
    variables      = require('./resources/variables');

// CORS
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Auth-Token');
  if (req.method === 'OPTIONS') return res.send(200);
  next();
});

// ROUTES
app.get('/', function(req, res) {
  res.send(200, { status: 'Ok' });
});

// Dashboards
app.get(    '/v1/dashboards', dashboards.find );
app.get(    '/v1/dashboards/:id', dashboards.findById );
app.post(   '/v1/dashboards', dashboards.createRecord );
app.put(    '/v1/dashboards/:id', dashboards.updateRecord );
app.delete( '/v1/dashboards/:id', dashboards.deleteRecord );
app.patch( '/v1/dashboards/:id', dashboards.patchRecord );

// Elements
app.get(    '/v1/elements', elements.find );
app.get(    '/v1/elements/:id', elements.findById );
app.post(   '/v1/elements', elements.createRecord );
app.put(    '/v1/elements/:id', elements.updateRecord );
app.delete( '/v1/elements/:id', elements.deleteRecord );
app.patch( '/v1/elements/:id', elements.patchRecord );

// Questionnaires
app.get(    '/v1/questionnaires', questionnaires.find );
app.get(    '/v1/questionnaires/:id', questionnaires.findById );
app.post(   '/v1/questionnaires', questionnaires.createRecord );
app.put(    '/v1/questionnaires/:id', questionnaires.updateRecord );
app.delete( '/v1/questionnaires/:id', questionnaires.deleteRecord );
app.patch( '/v1/questionnaires/:id', questionnaires.patchRecord );

// Reports
app.get(    '/v1/reports', reports.find );
app.get(    '/v1/reports/:id', reports.findById );
app.post(   '/v1/reports', reports.createRecord );
app.put(    '/v1/reports/:id', reports.updateRecord );
app.delete( '/v1/reports/:id', reports.deleteRecord );
app.patch( '/v1/reports/:id', reports.patchRecord );

// Variables
app.get(    '/v1/variables', variables.find );
app.get(    '/v1/variables/loneCOP', variables.cop );
app.get(    '/v1/variables/:id', variables.findById );
app.post(   '/v1/variables', variables.createRecord );
app.put(    '/v1/variables/:id', variables.updateRecord );
app.delete( '/v1/variables/:id', variables.deleteRecord );
app.patch( '/v1/variables/:id', variables.patchRecord );



var port = process.env.PORT || 3080;
app.listen(port, function() {
    console.log('Listening on port ', port);
});
