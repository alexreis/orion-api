var async = require('async'),
    mysql = require('mysql'),
    mongoose = require('mongoose');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

var Pactual = mysql.createConnection({
  host: '189.3.44.196',
  port: '3306',
  user: 'root',
  password: '',
  database: 'pactual'
});

Pactual.connect(function(err) { console.log('Pactual - id ' + Pactual.threadId); });

exports.find = function(req, res) {

  var from = '20140713',
      to = '20140717';

  Pactual.query('SHOW COLUMNS FROM pactualtrackingnacional', function(err, rows) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    var variables = [];
    rows.forEach(function(d) {
      variables.push({ _id: d.Field, name: d.Field });
    });

    async.each(variables, function(variable, callback) {
      var query = "SELECT SEXO, count(SEXO) FROM pactualtrackingnacional\
                  WHERE REM = 0\
                  AND criado BETWEEN '" + from + "' AND '" + to + "' GROUP BY SEXO";


    }, function(err) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});
    });

    return res.send(200, { variables: variables });
  });
};

exports.findById = function(req, res) {
  var column = req.params.id;

  var query1 = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional\
              WHERE REM = 0\
              AND ANO*10000+MES*100+DIA BETWEEN '20140713' AND '20140714'\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + column;

  var query2 = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional\
              WHERE REM = 0\
              AND ANO*10000+MES*100+DIA BETWEEN '20140714' AND '20140715'\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + column;

  var queries = [
    query1, query2
  ];
  
  async.each(queries, function(query, callback) {
    Pactual.query(query, function(err, rows) {
      
      console.log('rows', rows);
      return callback(null);
      // return res.send(200, { variable: { _id: req.params.id, name: req.params.id, data: rows }});
    });
  }, function(err) {
    return res.send(200);
  });
};

exports.createRecord = function(req, res) {
  return res.send(200, {});
};

exports.updateRecord = function(req, res) {
  return res.send(200, {});
};

exports.deleteRecord = function(req, res) {
  return res.send(200);
};

exports.patchRecord = function(req, res) {
  return res.send(501);
};
