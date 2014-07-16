var mysql = require('mysql'),
    d3 = require('d3');

// MySQL
var Pactual = mysql.createConnection({
  host: '189.3.44.196',
  port: '3306',
  user: 'root',
  password: '',
  database: 'pactual'
});

var Orion = mysql.createConnection({
  host: 'orion.voxdobrasil.com',
  port: '3306',
  user: 'alex',
  password: 'etropusvox',
  database: 'orion'
});

// Connect
Pactual.connect(function(err) { console.log('connected as id ' + Pactual.threadId); });
Orion.connect(function(err) { console.log('connected as id ' + Orion.threadId); });

// QUERIES


// Pactual.query('SHOW COLUMNS from pactualtrackingnacional', function(err, rows) {
//   console.log('rows', rows);
// });

Pactual.query("SELECT * FROM pactualtrackingnacional\
  WHERE criado\
  BETWEEN '2014-07-14' AND '2014-07-15'", function(err, data) {

    console.log('data', data);
  });

Pactual.query('SELECT * from pactualtrackingnacional WHERE REM = 0', function(err, rows) {
  var size = rows.length;

  console.log('size', size);
  // console.log(rows[0]);
});

var column = 'RENDA';
Pactual.query('SELECT ' + column + ', count(' + column + ')\
              FROM pactualtrackingnacional\
              WHERE REM = 0\
              GROUP BY ' + column + '',
              function(err, rows) {
  console.log( rows );
});


// Close
Pactual.end();
Orion.end();
