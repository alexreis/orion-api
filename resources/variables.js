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
  host: 'web.voxpopuli.com.br',
  port: '3306',
  user: 'alex',
  password: 'etropusvox',
  database: 'voxpopuli'
});

Pactual.connect(function(err) { console.log('Pactual - id ' + Pactual.threadId); });

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

exports.findById = function(req, res) {
  var column = req.params.id;
  var title = column;

  switch(column) {
    case 'TRABALHO':
    title = 'Condição de trabalho';
    labels = [];
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
    labels = [];
    break;
case 'SEXO':
    title = 'Sexo';
    labels = [ { name: 1, label: 'Masculino' }, { name: 2, label: 'Feminino' } ];
    break;
case 'IDADE':
    title = 'Idade';
    labels = [];
    break;
case 'IDADEF':
    title = 'Idade categorizada';
    labels = [];
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
    labels = [];
    break;
case 'PEA':
    title = 'Situação do trabalhador';
    labels = [];
    break;
case 'RENDAF':
    title = 'Renda domiciliar';
    labels = [];
    break;
case 'EPP':
    title = 'Intenção de voto espontânea para presidente';
    labels = [];
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
    labels = [];
    break;
case 'PVP2':
    title = 'Possibilidade de votar em Aécio';
    labels = [];
    break;
case 'PVP3':
    title = 'Possibilidade de votar em Eduardo';
    labels = [];
    break;
case 'ETP1':
    title = 'Intenção de voto estimulada para presidente';
    labels = [ { name: 1, label: 'Aécio Neves (PSDB)' },
  { name: 2, label: 'Dilma Roussef (PT)' },
  { name: 3, label: 'Eduardo Campos (PSB)' },
  { name: 4, label: 'Eduardo Jorge (PV)' },
  { name: 5, label: 'Eymael (PSDC)' },
  { name: 6, label: 'Levy Fidelix (PRTB)' },
  { name: 7, label: 'Luciana Genro (PSOL)' },
  { name: 8, label: 'Mauro Iasi (PCB)' },
  { name: 9, label: 'Pastor Everaldo (PSC)' },
  { name: 10, label: 'Rui Costa Pimenta (PCO)' },
  { name: 11, label: 'Zé Maria (PSTU)' },
  { name: 77, label: 'Ninguém/Branco/Nulo' },
  { name: 88, label: 'NS' },
  { name: 99, label: 'NR' } ];
  break;
case 'DVP':
    title = 'Percentual de indecisos';
    labels = [ { name: -1, label: '-1' },
  { name: 1, label: 'Sim' },
  { name: 2, label: 'Não' } ];
  break;
case 'CHP':
    title = 'Chance de vitória na eleição presidencial';
    labels = [];
    break;
case 'ETP2':
    title = 'Intenção de voto para 2 turno (Cenário 1)';
    labels = [ { name: 1, label: 'Aécio Neves (PSDB)' },
  { name: 2, label: 'Dilma Roussef (PT)' },
  { name: 7, label: 'Ninguém/Branco/Nulo' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ETP3':
    title = 'Intenção de voto para 2 turno (Cenário 2)';
    labels = [ { name: 1, label: 'Dilma Roussef (PT)' },
  { name: 2, label: 'Eduardo Campos (PSB)' },
  { name: 7, label: 'Ninguém/Branco/Nulo' },
  { name: 8, label: 'NS' },
  { name: 9, label: 'NR' } ];
  break;
case 'ADP2':
    title = 'Avaliação do desempenho da presidenta Dilma';
    labels = [];
    break;
case 'C3':
    title = 'Satisfação em relação ao Brasil';
    labels = [];
    break;
case 'IPG':
    title = 'Grau de interesse por política';
    labels = [];
    break;
case 'CONV':
    title = 'Engajamento em conversa/discussão política';
    labels = [];
    break;
case 'NET1':
    title = 'Hábito de acessar a internet';
    labels = [];
    break;
case 'REL1':
    title = 'Religião';
    labels = [];
    break;
case 'REL2':
    title = 'Frequência com que vai à igreja/culto';
    labels = [];
    break;
case 'COR':
    title = 'Cor/Raça';
    labels = [];
    default:
    title = column;
    break;
  }

  // -------------------------------------------------------
  var format = d3.time.format('%Y%m%d'),
      format2 = d3.time.format('%Y-%m-%d'),
      tomorrow = d3.time.day.offset(new Date(), 1);

  if (req.query.from && req.query.to) {
      var from = req.query.from.replace(/-/g, '');
      var to = req.query.to.replace(/-/g, '');
      to = format(d3.time.day.offset(format.parse(to), 1));
  } else {
    var from = '20140714',
        to = format(tomorrow);
  }
  
  console.log('from', from);
  console.log('to', to);
    
  var dates = d3.time.day.range(format.parse(from), format.parse(to), 1);
  console.log('DATES', dates);
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


    console.log('lowerDate', lowerDate);
    console.log('upperDate', upperDate);
    var query = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional_backup\
              WHERE REM = 0\
              AND ANO*10000+MES*100+DIA BETWEEN '" + lowerDate + "' AND '" + upperDate + "'\
              AND ELEITOR = 1 AND TRABALHO = 2 AND ESC < 5 AND RENDAF < 9\
              GROUP BY " + column;

    queries.push(query);
  }

  // -------------------------------------------------------

  async.waterfall([
    function(callback) {
      var query = "SELECT " + column + ", count(" + column + ") FROM pactualtrackingnacional_backup\
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

    
    // console.log( 'results', results );
    var total = 0;
    results.forEach(function(d, i) {
      // console.log('RESULT D', d);

      d.values.forEach(function(v) {
        total += v.value;
      });

      labels.forEach(function(dd) {
        if (d.name === dd.name) {
          d.name = dd.label;
        }
      });
    });

    results.forEach(function(d, i) {
      d.values.forEach(function(v) {
        v.value = d3.round((v.value/total) * 100, 2);
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
