var async = require('async'),
    d3 = require('d3'),
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

  var from = '2014-07-10',
      to = '2014-07-17';

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
  
  // -------------------------------------------------------
  var format = d3.time.format('%Y%m%d'),
      format2 = d3.time.format('%Y-%m-%d'),
      tomorrow = d3.time.day.offset(new Date(), 1);

  if (req.query.from && req.query.to) {
    var from = req.query.from.replace(/-/g, '');
    var to = req.query.to.replace(/-/g, '');
  } else {
    var from = '20140710',
        to = format(tomorrow);
  }
  
    
  var dates = d3.time.day.range(format.parse(from), format.parse(to), 1);
  var dateStrings = [];
  var dateStrings2 = [];
  dates.forEach(function(d) {
    dateStrings.push(format(d));
    dateStrings2.push(format2(d));
  });

  var queries = [];
  var n = dateStrings.length;

  for (var i = 0; i < n - 1; i++) {
    var query = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional\
              WHERE REM = 0\
              AND ANO*10000+MES*100+DIA BETWEEN '" + dateStrings[i] + "' AND '" + dateStrings[i + 1] + "'\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + column;

    queries.push(query);
  }

  // -------------------------------------------------------

  async.waterfall([
    function(callback) {
      var query = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional\
              WHERE REM = 0\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + column;

      Pactual.query(query, function(err, data) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error.' }});
        
        var values = [];
        data.forEach(function(d) {
          values.push({ name: d[req.params.id] });
        });

        return callback(null, values);
      });
    },

    function(values, callback) {
      var results = [];
      async.each(queries, function(query, callback2) {
        Pactual.query(query, function(err, rows) {
          results.push(rows);

          return callback2(null);
          
        });
      }, function(err) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error.' }});
        
        return callback(null, values, results);
      });
    },

    function(values, results, callback) {
      var holder = [];
      
      var n = values.length;
      values.forEach(function(d) {
        d.values = [];

        results.forEach(function(dd, ii) {
            if (dd.length === 0) {
              d.values.push({ date: dateStrings2[ii], value: 0});
            } else {

              var t = false;
              dd.forEach(function(ddd, iii) {
                if (ddd[req.params.id] === d.name) {
                  t = iii;
                }
              });

              if (t !== false) {
                d.values.push({ date: dateStrings2[ii], value: dd[t]['count(' + req.params.id + ')']});
              } else {
                d.values.push({ date: dateStrings2[ii], value: 0});
              }
            }
          
        });
      });

      return callback(null, values);
    }
  ], function(err, results) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    console.log( 'result',  results);
    return res.send(200, { variable: { _id: req.params.id, name: req.params.id, data: results }});
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
