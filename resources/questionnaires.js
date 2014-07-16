var async = require('async'),
    mongoose = require('mongoose');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

exports.find = function(req, res) {
  Questionnaire.find({})
    .exec(function(err, questionnaires) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send(200, { questionnaires: questionnaires });
    });
};

exports.findById = function(req, res) {
  var questionnaireId = req.params.id;

  Questionnaire.findById(questionnaireId)
    .exec(function(err, questionnaire) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send(200, { questionnaire: questionnaire });
    });
};

exports.createRecord = function(req, res) {
  var questionnaire = new Questionnaire({
    name: req.body.questionnaire.name
  });

  questionnaire.save(function(err) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send(200, { questionnaire: questionnaire });
  });
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
