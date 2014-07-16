var async = require('async'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    request = require('request');

mongoose.connect('mongodb://orion:sdfwer@localhost:27017/orion', function() {
  console.log( "Conection with orion started" );
});

// console.log('__dirname', __dirname);
var models_path = '/Users/fabriciotav/Dropbox/gists/vox/analytics' + '/models';
var model_files = fs.readdirSync(models_path);

model_files.forEach(function(file) {
  require(models_path + '/' + file);
});

var Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Element = mongoose.model('Element');

request({
  url: 'http://localhost:3080/v1/questionnaires'
}, function(err, res) {
  var body = JSON.parse(res.body);
  console.log('questionnaires', body);
});

var questionnaire = new Questionnaire({
  name: 'Questionário 1',
  variables: ['q-01', 'q-02', 'q-03', 'q-04']
});

questionnaire.save();
