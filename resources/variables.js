var async = require('async'),
    d3 = require('d3'),
    mongoose = require('mongoose'),
    mysql = require('mysql');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

var Pactual = mysql.createConnection({
  host:     'web.voxpopuli.com.br',
  port:     '3306',
  user:     'alex',
  password: 'etropusvox',
  database: 'voxpopuli'
});

Pactual.connect(function(err) { console.log('Connected to Pactual database - ' + Pactual.threadId); });

// ---------------------------------------------------------------------------
// HELPERS
var format = d3.time.format('%Y%m%d'),
    format2 = d3.time.format('%Y-%m-%d');

// ---------------------------------------------------------------------------
// EXPORTS
exports.find = function(req, res) {

  var from = '2014-07-10',
      to = '2014-07-17';

  Pactual.query('SHOW COLUMNS FROM pactualtrackingnacional_backup', function(err, rows) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    var variables = [];
    rows.forEach(function(d) {
      variables.push({ _id: d.Field, name: d.Field });
    });

    async.each(variables, function(variable, callback) {
      var query = "SELECT SEXO, count(SEXO) FROM pactualtrackingnacional_backup\
                  WHERE REM = 0\
                  AND criado BETWEEN '" + from + "' AND '" + to + "' GROUP BY SEXO";


    }, function(err) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});
    });

    return res.send(200, { variables: variables });
  });
};


exports.crossings = function(req, res) {  // GET :: http://DOMAIN.com.br/v1/variables/crossings/:current_var/:cross_var
  // ---------------------------------------------------------------------------
  // Set the current var parameters
  //
  var currentVar = req.params.current_var,
      crossVar = req.params.cross_var;

  var currentVarEncodings = getLabels(currentVar),
      currentVarTitle = currentVarEncodings.title;
      currentVarLabels = currentVarEncodings.labels;

  var crossVarEncodings = getLabels(crossVar),
      crossVarTitle = crossVarEncodings.title;
      crossVarLabels = crossVarEncodings.labels;

  // ---------------------------------------------------------------------------
  // Setting up query for each day
  //
  var tomorrow = d3.time.day.offset(new Date(), 1);

  if (req.query.from && req.query.to) {
    var from = req.query.from.replace(/-/g, ''),
        to = req.query.to.replace(/-/g, '');
    
    to = format(d3.time.day.offset(format.parse(to), 1));
  } else {
    var from = '20140714',
        to = format(tomorrow);
  }
  
  var dates = d3.time.day.range(format.parse(from), format.parse(to), 1);
  var dateStrings = [];
  var dateStrings2 = [];
  dates.forEach(function(d) {
    dateStrings.push(format(d));
    dateStrings2.push(format2(d));
  });

  var queriesByDate = [];
  var n = dateStrings.length;



  for (var i = 0; i < n - 1; i++) {
    var lowerDate = format.parse(dateStrings[i]);
    lowerDate = d3.time.day.offset(lowerDate, -4);
    lowerDate = format(lowerDate);

    var upperDate = dateStrings[i];




// Get the queries based on the cross variable.
  var queriesByVar = [];
  switch(crossVar) {
    case 'ZONA':
    /* Agrupado por zona (1.urbana) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ZONA=1\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"

    /* Agrupado por zona (2.rural) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ZONA=2\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
      queriesByVar = [query1, query2];
      break;
    // end case ZONA

    case 'SEXO':
    /* Agrupado por sexo (1.masculino) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND SEXO=1\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"

    /* Agrupado por sexo (2.feminino) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND SEXO=2\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
      queriesByVar = [query1, query2];
      break;

    case 'IDADEF':
    /* Agrupado por idade (1a2.jovens) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND IDADEF>=1 AND IDADEF<=2\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por idade (3a5.adultos) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND IDADEF>=3 AND IDADEF<=5\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por idade (6.Idosos) */
    var query3 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND IDADEF=6\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
      queriesByVar = [query1, query2, query3];
      break;

    case 'ESC':
    /* Agrupado por escolaridade (1.até 4a serie) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ESC=1\
    GROUP BY V";

    /* Agrupado por escolaridade (2.até 9a serie) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ESC=2\
    GROUP BY V";
    
    /* Agrupado por escolaridade (3.ensino medio) */
    var query3 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ESC=3\
    GROUP BY V";

    /* Agrupado por escolaridade (4.superior) */
    var query4 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND ESC=4\
    GROUP BY V";
      queriesByVar = [query1, query2, query3, query4];
      break;


    case 'PEA':
    /* Agrupado por situação de emprego (1.pea) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND PEA=1\
    GROUP BY V";
    
    /* Agrupado por situação de emprego (2.não pea) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND PEA=2\
    GROUP BY V";
      queriesByVar = [query1, query2];
      break;


    case 'RENDAF':
    /* Agrupado por renda (1.até 2sm) */
    var query1 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND RENDAF>=1 AND RENDAF<=2\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por renda (2. 2sm a 5sm) */
    var query2 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND RENDAF>=3 AND RENDAF<=4\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por renda (3.5sm a 10sm) */
    var query3 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND RENDAF=5\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por renda (10sm a 20sm) */
    var query4 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND RENDAF>=6 AND RENDAF<=7\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
    
    /* Agrupado por renda (5.mais de 20sm) */
    var query5 = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
    rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
    AND RENDAF=8\
    AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    GROUP BY V;"
      queriesByVar = [query1, query2, query3, query4, query5];
      break;
  }
    // var query = "SELECT " + currentVar + ", count(" + currentVar + ") FROM pactualtrackingnacional_backup\
    //           WHERE REM = 0\
    //           AND " + currentVar + " != -1\
    //           AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
    //           AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
    //           GROUP BY " + currentVar;

    queriesByDate.push(queriesByVar);
  }

  //     /* Resultado completo*/
  var queryAll = "select " + currentVar + " AS V,count(*) from pactualtrackingnacional_backup where\
                  rem=0 and (ELEITOR=1 AND TRABALHO=2 AND ESC<5 AND RENDAF<9 AND INVALIDO!=1)\
                  GROUP BY V";

  async.waterfall([
    function(callback) {
      Pactual.query(queryAll, function(err, data) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error.' }});
        
        var values = [];
        data.forEach(function(d) {
          values.push({ name: d['V'] });
        });

        return callback(null, values);
      });
    },

    function(values, callback) {

//-------

  var valuesInside = [];

  async.each(queriesByDate, function(queryByDate, callbackEachDate) {

    var results = [];
    async.each(queryByDate, function(queryByVar, callbackEachVar) {
      console.log('queryByVar--------------------------------------------------\n');
      
      Pactual.query(queryByVar, function(err, data) {
        if (err) return callbackEachVar({ error: { status: 500, message: 'Internal Server Error.' }});
        
        data.forEach(function(d) {
          results.push({ name: d['V'] });          
        });

        values.forEach(function(d) {
          d.values = [];
          console.log('results', results);
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
                d.values.push({ date: dateStrings2[ii], value: dd[t]['count(*)']});
              } else {
                d.values.push({ date: dateStrings2[ii], value: 0});
              }
            }
          });
        });
        // valuesInside.push(results);

        return callbackEachVar(null);
      });
    }, function(err) {

        return callbackEachDate(null);
    });
  }, function(err) {
    // Error in queryByDate

    console.log('END');
    console.log('valuesInside', valuesInside);
  });

  

//-------


    }
  ], function(err, results) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

  });


  // console.log('queriesByDate', queriesByDate);



  // async.each(queriesByDate, function(query, callbackEach) {
  //   Pactual.query(query, function(err, rows) {
  //     console.log('ROWS', rows);
  //   });
  // }, function(err) {
  //   // Error getting the queries
  // });

 return res.send(200);
};

exports.findById = function(req, res) {  // GET :: http://DOMAIN.com.br/v1/variables/:id
  // ---------------------------------------------------------------------------
  // Set the current var parameters
  //
  var currentVar = req.params.id;

  var currentVarEncodings = getLabels(currentVar),
      title = currentVarEncodings.title;
      labels = currentVarEncodings.labels;

  // ---------------------------------------------------------------------------
  // Setting up query for each day
  //
  var tomorrow = d3.time.day.offset(new Date(), 1);

  if (req.query.from && req.query.to) {
    var from = req.query.from.replace(/-/g, ''),
        to = req.query.to.replace(/-/g, '');
    
    to = format(d3.time.day.offset(format.parse(to), 1));
  } else {
    var from = '20140714',
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
    var lowerDate = format.parse(dateStrings[i]);
    lowerDate = d3.time.day.offset(lowerDate, -4);
    lowerDate = format(lowerDate);
    var upperDate = dateStrings[i];

    var query = "SELECT " + currentVar + ", count(" + currentVar + ") FROM pactualtrackingnacional_backup\
              WHERE REM = 0\
              AND " + currentVar + " != -1\
              AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + currentVar;

    queries.push(query);
  }

  // -------------------------------------------------------

  async.waterfall([
    function(callback) {
      var query = "SELECT " + currentVar + ", count(" + currentVar + ") FROM pactualtrackingnacional_backup\
              WHERE REM = 0\
              AND " + currentVar + " != -1\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + currentVar;

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
      
      console.log('valuesvaluesvaluesvaluesvaluesvaluesvalues', values);
      console.log('resultsresultsresultsresultsresultsresults', results);
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

    var total = 0;
    
    var DATES = dateStrings2.slice(0,-1);
        DATESobj = [];
      
      DATES.forEach(function(DD) {
        DATESobj.push({date: DD, total: 0});
      });      

    // Add label
    results.forEach(function(d, i) {
      labels.forEach(function(dd) {
        if (d.name === dd.name) {
          d.name = dd.label;
        }
      });
    });

    // Computes total
    results.forEach(function(d, i) {
      d.values.forEach(function(dd) {
        DATESobj.forEach(function(obj) {
          if (obj.date === dd.date) {
              obj.total += dd.value;
          }
        });
      });
    });

    // console.log('\n2------DATESobj\n', DATESobj);

    // Computes total
    results.forEach(function(d, i) {
        d.values.forEach(function(v) {
          DATESobj.forEach(function(obj) {
          if (obj.date === v.date) {
            v.value = d3.round((v.value/obj.total) * 100, 0);
          }
        });
      });
    });

    results.forEach(function(d) {

      var format2 = d3.time.format('%Y-%m-%d'),
          yesterday = d3.time.day.offset(new Date(), -1);

      d.values.forEach(function(dd) {
        dd.date = format2(d3.time.day.offset(format2.parse(dd.date), -1));
      });
    });
    

    return res.send(200, { variable: { _id: req.params.id, name: req.params.id, title: title, data: results }});
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



// Get the correct title for each variable in the database, and the correct
// labels for the opions.
var getLabels = function(currentVarName) {
var title = null,
    labels = [];

switch(currentVarName) {
    case 'TRABALHO':
    title = 'Condição de trabalho';
    labels = [
    { name: 1, label: 'Sim' },
    { name: 2, label: 'Não' }
    ];
    break;
case 'ROD':
    title = 'Rodada do tracking';
    labels = [];
    break;
case 'MUN':
    title = 'Município';
    labels = [];
    break;
case 'ZONA':
    title = 'Zona residencial';
    labels = [];
    break;
case 'UF':
    title = 'Estado';
    labels = [
    { name: 1, label: 'AC' },
    { name: 2, label: 'AL' },
    { name: 3, label: 'AP' },
    { name: 4, label: 'AM' },
    { name: 5, label: 'BA' },
    { name: 6, label: 'CE' },
    { name: 7, label: 'DF' },
    { name: 8, label: 'ES' },
    { name: 9, label: 'GO' },
    { name: 10, label: 'MA' },
    { name: 11, label: 'MT' },
    { name: 12, label: 'MS' },
    { name: 13, label: 'MG' },
    { name: 14, label: 'PB' },
    { name: 15, label: 'PR' },
    { name: 16, label: 'PA' },
    { name: 17, label: 'PE' },
    { name: 18, label: 'PI' },
    { name: 19, label: 'RJ' },
    { name: 20, label: 'RN' },
    { name: 21, label: 'RS' },
    { name: 22, label: 'RO' },
    { name: 23, label: 'RR' },
    { name: 24, label: 'SC' },
    { name: 25, label: 'SE' },
    { name: 26, label: 'SP' },
    { name: 27, label: 'TO' }
    ];
    break;
case 'SEXO':
    title = 'Sexo';
    labels = [ { name: 1, label: 'Masculino' }, { name: 2, label: 'Feminino' } ];
    break;
case 'IDADE':
    title = 'Idade';
    labels = [
    ];
    break;
case 'IDADEF':
    title = 'Idade categorizada';
    labels = [
      { name: 1, label: '16 a 17 anos' },
      { name: 2, label: '18 a 24 anos' },
      { name: 3, label: '25 a 34 anos' },
      { name: 4, label: '35 a 44 anos' },
      { name: 5, label: '45 a 59 anos' },
      { name: 6, label: '60 anos ou mais' }
    ];
    break;
case 'ESC':
    title = 'Grau de escolaridade';
    labels = [ { name: 1, label: 'Até 4a série ou 5o ano do Ensino Fundamental' },
  { name: 2, label: 'De 5a até 8a série ou do 6o até o 9o ano do Ensino Fundamental' },
  { name: 3, label: 'Ensino Médio completo ou incompleto' },
  { name: 4, label: 'Superior completo ou incompleto' } ];
  break;
case 'SIT':
    title = 'Situação do trabalho';
    labels = [
    { name: 1, label: 'Trabalhando em emprego com carteira assinada'},
{ name: 2, label: 'Funcionário público estatutário'},
{ name: 3, label: 'Trabalhando em emprego sem carteira assinada'},
{ name: 4, label: 'Trabalhando como autônomo' },
{ name: 5, label: 'Profissional liberal' },
{ name: 6, label: 'Empregador' },
{ name: 7, label: 'Está desempregado há menos de 1 ano'},
{ name: 8, label: 'Está desempregado há mais de 1 ano' },
{ name: 9, label: 'É estudante' },
{ name: 10, label: 'Aposentado' },
{ name: 11, label: 'Dona de casa' }
    ];
    break;
case 'PEA':
    title = 'Situação do trabalhador';
    labels = [
      { name: 1, label: 'PEA' },
      { name: 2, label: 'Não PEA' }
    ];
    break;
case 'RENDAF':
    title = 'Renda domiciliar';
    labels = [];
    break;
case 'EPP':
    title = 'Intenção de voto espontânea para presidente';
    labels = [
      { name: 1, label: 'Aécio' },
      { name: 2, label: 'Dilma' },
      { name: 3, label: 'Eduardo' },
      { name: 4, label: 'Eduardo Jorge' },
      { name: 5, label: 'Eymael' },
      { name: 6, label: 'Levy Fidelix (PRTB)' },
      { name: 7, label: 'Luciana Genro (PSOL)' },
      { name: 8, label: 'Mauro Iasi (PCB)' },
      { name: 9, label: 'Pastor Everaldo (PSC)' },
      { name: 10, label: 'Rui Costa Pimenta (PCO)'},
      { name: 11, label: 'Zé Maria (PSTU)'},
      { name: 12, label: 'Lula' },
      { name: 13, label: 'Marina Silva' },
      { name: 14, label: 'José Serra' },
      { name: 15, label: 'Outros' },
      { name: 77, label: 'Ninguém' },
      { name: 88, label: 'NS'},
      { name: 99, label: 'NR' }
    ];
    break;

case 'EPPR2':
    title = 'Intenção de voto espontânea para presidente';
    labels = [
      { name: 1, label: 'Aécio' },
      { name: 2, label: 'Dilma' },
      { name: 3, label: 'Eduardo' },
      // { name: 4, label: 'Eduardo Jorge' },
      // { name: 5, label: 'Eymael' },
      // { name: 6, label: 'Levy Fidelix (PRTB)' },
      // { name: 7, label: 'Luciana Genro (PSOL)' },
      // { name: 8, label: 'Mauro Iasi (PCB)' },
      // { name: 9, label: 'Pastor Everaldo (PSC)' },
      // { name: 10, label: 'Rui Costa Pimenta (PCO)'},
      // { name: 11, label: 'Zé Maria (PSTU)'},
      // { name: 12, label: 'Lula' },
      // { name: 13, label: 'Marina Silva' },
      // { name: 14, label: 'José Serra' },
      { name: 15, label: 'Outros' },
      { name: 77, label: 'Ninguém' },
      { name: 88, label: 'NS'},
      { name: 99, label: 'NR' }
    ];
    break;
case 'COP1':
    title = 'Grau de conhecimento a respeito de Dilma';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'COP2':
    title = 'Grau de conhecimento a respeito de Aécio';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'COP3':
    title = 'Grau de conhecimento a respeito de Eduardo';
    labels = [
        { name: 1, label: 'Conhece bem/tem muitas informações sobre ele(a)' },
        { name: 2, label: 'Conhece, mas não muito/tem algumas informações sobre ele(a)' },
        { name: 3, label: 'Conhece só de nome/só de ouvir falar' },
        { name: 4, label: 'Não conhece/É a primeira vez que ouve falar o nome' },
        { name: 9, label: 'NR' }
      ];
      break;
case 'PVP1':
    title = 'Possibilidade de votar em Dilma';
    labels = [
    { name: 1, label: 'Grande possibilidade'},
{ name: 2, label: 'Possibilidade média/razoável'},
{ name: 3, label: 'Possibilidade pequena'},
{ name: 4, label: 'Nenhuma possibilidade'},
{ name: 8, label: 'NS/Não conhece o suficiente para opinar'},
{ name: 9, label: 'NR'}
    ];
    break;
case 'PVP2':
    title = 'Possibilidade de votar em Aécio';
    labels = [
    { name: 1, label: 'Grande possibilidade'},
{ name: 2, label: 'Possibilidade média/razoável'},
{ name: 3, label: 'Possibilidade pequena'},
{ name: 4, label: 'Nenhuma possibilidade'},
{ name: 8, label: 'NS/Não conhece o suficiente para opinar'},
{ name: 9, label: 'NR'}
    ];
    break;
case 'PVP3':
    title = 'Possibilidade de votar em Eduardo';
    labels = [
    { name: 1, label: 'Grande possibilidade'},
{ name: 2, label: 'Possibilidade média/razoável'},
{ name: 3, label: 'Possibilidade pequena'},
{ name: 4, label: 'Nenhuma possibilidade'},
{ name: 8, label: 'NS/Não conhece o suficiente para opinar'},
{ name: 9, label: 'NR'}
    ];
    break;
case 'ETP1':
    title = 'Intenção de voto estimulada para presidente';
    labels = [ { name: 1, label: 'Aécio' },
  { name: 2, label: 'Dilma' },
  { name: 3, label: 'Eduardo' },
  { name: 4, label: 'Eduardo Jorge' },
  { name: 5, label: 'Eymael' },
  { name: 6, label: 'Levy Fidelix (PRTB)' },
  { name: 7, label: 'Luciana Genro (PSOL)' },
  { name: 8, label: 'Mauro Iasi (PCB)' },
  { name: 9, label: 'Pastor Everaldo (PSC)' },
  { name: 10, label: 'Rui Costa Pimenta (PCO)' },
  { name: 11, label: 'Zé Maria (PSTU)' },
  { name: 77, label: 'Ninguém' },
  { name: 88, label: 'NS' },
  { name: 99, label: 'NR' } ];
  break;

  case 'ETP1R2':
    title = 'Intenção de voto estimulada para presidente';
    labels = [ { name: 1, label: 'Aécio' },
  { name: 2, label: 'Dilma' },
  { name: 3, label: 'Eduardo' },
  // { name: 4, label: 'Eduardo Jorge' },
  // { name: 5, label: 'Eymael' },
  // { name: 6, label: 'Levy Fidelix (PRTB)' },
  // { name: 7, label: 'Luciana Genro (PSOL)' },
  // { name: 8, label: 'Mauro Iasi (PCB)' },
  // { name: 9, label: 'Pastor Everaldo (PSC)' },
  // { name: 10, label: 'Rui Costa Pimenta (PCO)' },
  // { name: 11, label: 'Zé Maria (PSTU)' },
  { name: 15, label: 'Outros' },
  { name: 77, label: 'Ninguém' },
  { name: 88, label: 'NS' },
  { name: 99, label: 'NR' } ];
  break;
case 'DVP':
    title = 'Percentual de decididos';
    labels = [ { name: -1, label: '-1' },
      { name: 1, label: 'Decididos' },
      { name: 2, label: 'Indecisos' } ];
  break;
case 'CHP':
    title = 'Quem vai ganhar?';
    labels = [
    { name: 1, label: 'Aécio'},
{ name: 2, label: 'Dilma'},
{ name: 3, label: 'Eduardo'},
{ name: 8, label: 'NS'},
{ name: 9, label: 'NR'},
{ name: 88, label: 'NS'},
{ name: 99, label: 'NR'}
    ];
    break;
case 'ETP2':
    title = '2o turno Dilma vs Aécio';
    labels = [ { name: 1, label: 'Aécio' },
  { name: 2, label: 'Dilma' },
  { name: 7, label: 'Ninguém' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ETP3':
    title = '2o turno Dilma vs Eduardo';
    labels = [ { name: 1, label: 'Dilma' },
  { name: 2, label: 'Eduardo' },
  { name: 7, label: 'Ninguém' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ADP2':
    title = 'Avaliação do desempenho da presidenta Dilma';
    labels = [
    { name: 1, label: 'Ótimo' },
{ name: 2, label: 'Bom' },
{ name: 3, label: 'Regular positivo' },
{ name: 4, label: 'Regular negativo' },
{ name: 5, label: 'Ruim' },
{ name: 6, label: 'Péssimo' },
{ name: 8, label: 'NS' },
{ name: 9, label: 'NR' }
    ];
    break;
case 'C3':
    title = 'Satisfação em relação ao Brasil';
    labels = [
      { name: 1, label: 'Muito satisfeito'},
      { name: 2, label: 'Satisfeito'},
      { name: 3, label: 'Insatisfeito'},
      { name: 4, label: 'Muito insatisfeito'},
      { name: 8, label: 'NS'},
      { name: 9, label: 'NR'}
    ];
    break;
case 'IPG':
    title = 'Grau de interesse por política';
    labels = [
    { name: 1, label: 'Muito interessada' },
{ name: 2, label: 'Mais ou menos interessada' },
{ name: 3, label: 'Pouco interessada' },
{ name: 4, label: 'Nada interessada' },
{ name: 9, label: 'NR' }
    ];
    break;
case 'CONV':
    title = 'Engajamento em conversa/discussão política';
    labels = [
      { name: 1, label: 'Sim'},
      { name: 2, label: 'Não'},
      { name: 8, label: 'NS/Não lembra'},
      { name: 9, label: 'NR'}
    ];
    break;
case 'NET1':
    title = 'Hábito de acessar a internet';
    labels = [
      { name: 1, label: 'Todo dia / quase todo dia' },
      { name: 2, label: 'De vez em quando (algumas vezes por semana)'},
      { name: 3, label: 'Raramente' },
      { name: 4, label: 'Nunca/não acessa a internet' },
      { name: 9, label: 'NR (ESPONTÂNEA)' }
    ];
    break;
case 'REL1':
    title = 'Religião';
    labels = [
      { name: 24, label: 'Sem religião' },
      { name: 99, label: 'NR' }
    ];
    break;
case 'REL2':
    title = 'Frequência com que vai à igreja/culto';
    labels = [
      { name: 1, label: 'Toda semana/quase toda semana' },
      { name: 2, label: 'De vez em quando (algumas vezes por mês)' },
      { name: 3, label: 'Raramente (frequência superior a 1 mês)' },
      { name: 4, label: 'Nunca vai à igreja/ao culto' },
      { name: 9, label: 'NR' }
    ];
    break;
case 'COR':
    title = 'Cor/Raça';
    labels = [
      { name: 1, label: 'Branca' },
      { name: 2, label: 'Preta' },
      { name: 3, label: 'Parda' },
      { name: 4, label: 'Amarela' },
      { name: 5, label: 'Indígena' },
      { name: 8, label: 'NS' },
      { name: 9, label: 'NR' }
    ];
    default:
    title = column;
    break;
  }

  return { title: title, labels: labels };
};
