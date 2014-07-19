var async = require('async'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    express = require('express'),
    mysql = require('mysql'),
    session = require('express-session'),
    cookieSession = require('cookie-session'),
    RedisStore = require('connect-redis')(session);

var users = [
    { username: 'fabriciotav', password: 'sdfwer' },
    { username: 'felipenunes', password: 'felipe1234' },
    { username: 'antonio', password: '126712' },
    { username: 'todos', password: 'camila' },
    { username: 'JS2014', password: 'DL1014' },
    { username: 'monicamoura2014', password: '654321' },
    { username: 'Edu', password: '586270' },
    { username: 'mkertesz', password: '757562' },
    { username: 'marta', password: 'marta1234' },
    { username: 'kleber', password: 'kleber1234' },
    { username: 'marlene', password: 'marlene1234' },
    { username: 'joaofrancisco', password: 'joaofrancisco1234' },
    { username: 'marcos', password: 'marcos1234' },
    { username: 'felipe', password: 'felipe1234' },
    { username: 'pactual', password: 'pactual1234' },
    { username: 'pt', password: 'pt1234' },
    { username: 'ruifalcao', password: 'ruifalcao1234' },
    { username: 'quali', password: 'quali1234' },
    { username: 'vox', password: 'vox1234' },
    { username: 'marcio', password: 'marcio1234' }
  ];

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

var restrict = function(req, res, next) {
  var token = req.headers['x-auth-token'];
  if (token !== undefined) {
    token = Base64.decode(token);
    var username = token.split('%')[0],
        password = token.split('%')[1];
    
    var ok = false;
    users.forEach(function(d) {
      if (d.username === username && d.password === password) {
        ok = true;
      }
    });
  
    if (!ok) {
      return res.send(403);
    } else {
      next();
    }
  } else {
    return res.send(403);
  }
};

app.get('/session', function(req, res) {
var token = req.headers['x-auth-token'];
  if (token !== undefined) {
    token = Base64.decode(token);
    var username = token.split('%')[0],
        password = token.split('%')[1];
    
    var ok = false;
    users.forEach(function(d) {
      if (d.username === username && d.password === password) {
        ok = true;
      }
    });
  
    if (!ok) {
      return res.send(403);
    } else {
      return res.send(200);
    }
  } else {
    return res.send(403);
  }
});

app.post('/login', function(req, res) {
  var username = req.body.username,
      password = req.body.password;

  var user = null;
  users.forEach(function(d) {
    if (d.username === username && d.password === password) {
      user = { username: username }
    }
  });

    if (user !== null) {
        user = user;
        return res.send(200, { token: Base64.encode(username + '%' + password) });
    } else {
      res.send(403);
    }
});

// Dashboards
app.get(    '/v1/dashboards', restrict, dashboards.find );
app.get(    '/v1/dashboards/:id', restrict, dashboards.findById );
app.post(   '/v1/dashboards', restrict, dashboards.createRecord );
app.put(    '/v1/dashboards/:id', restrict, dashboards.updateRecord );
app.delete( '/v1/dashboards/:id', restrict, dashboards.deleteRecord );
app.patch( '/v1/dashboards/:id', restrict, dashboards.patchRecord );

// Elements
app.get(    '/v1/elements', restrict, elements.find );
app.get(    '/v1/elements/:id', restrict, elements.findById );
app.post(   '/v1/elements', restrict, elements.createRecord );
app.put(    '/v1/elements/:id', restrict, elements.updateRecord );
app.delete( '/v1/elements/:id', restrict, elements.deleteRecord );
app.patch( '/v1/elements/:id', restrict, elements.patchRecord );

// Questionnaires
app.get(    '/v1/questionnaires', restrict, questionnaires.find );
app.get(    '/v1/questionnaires/:id', restrict, questionnaires.findById );
app.post(   '/v1/questionnaires', restrict, questionnaires.createRecord );
app.put(    '/v1/questionnaires/:id', restrict, questionnaires.updateRecord );
app.delete( '/v1/questionnaires/:id', restrict, questionnaires.deleteRecord );
app.patch( '/v1/questionnaires/:id', restrict, questionnaires.patchRecord );

// Reports
app.get(    '/v1/reports', restrict, reports.find );
app.get(    '/v1/reports/:id', restrict, reports.findById );
app.post(   '/v1/reports', restrict, reports.createRecord );
app.put(    '/v1/reports/:id', restrict, reports.updateRecord );
app.delete( '/v1/reports/:id', restrict, reports.deleteRecord );
app.patch( '/v1/reports/:id', restrict, reports.patchRecord );

// Variables
app.get(    '/v1/variables', restrict, variables.find );
app.get(    '/v1/variables/crossings/:current_var/:cross_var', restrict, variables.crossings );
app.get(    '/v1/variables/:id', restrict, variables.findById );
app.post(   '/v1/variables', restrict, variables.createRecord );
app.put(    '/v1/variables/:id', restrict, variables.updateRecord );
app.delete( '/v1/variables/:id', restrict, variables.deleteRecord );
app.patch( '/v1/variables/:id', restrict, variables.patchRecord );



var port = process.env.PORT || 3080;
app.listen(port, function() {
    console.log('Listening on port ', port);
});

var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

};

