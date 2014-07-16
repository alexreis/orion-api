var async = require('async'),
    mongoose = require('mongoose');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

exports.find = function(req, res) {


  async.waterfall([
    function(callback) {
      Report.find(req.query)
      .exec(function(err, reports) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        async.each(reports, function(report, callback2) {
          Element.find({report: report._id})
            .exec(function(err, elements) {
              if (err) return callback2({ error: { status: 500, message: 'Internal Server Error' }});

              report.elements = elements;

              return callback2(null);
            });
        }, function(err) {
          if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

          return callback(null, reports);
        });
      });
    }
  ], function(err, results) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send({ reports: results });
  });
};

exports.findById = function(req, res) {
  Report.findById(req.params.id)
    .exec(function(err, report) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send({ report: report });
    });
};

exports.createRecord = function(req, res) {
  var report = new Report({
    name: req.body.report.name,
    description: req.body.report.description,
    elements: []
  });

  report.save(function(err) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send(200, { report: report });
  });
};

exports.updateRecord = function(req, res) {
  var reportId = req.params.id;

  Report.findById(reportId)
    .exec(function(err, report) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      report.name = req.body.report.name;
      report.description = req.body.report.description;

      report.save(function(err) {
        if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

        return res.send(200, { report: report });
      });
    });
};

exports.deleteRecord = function(req, res) {
  return res.send(200);
};

exports.patchRecord = function(req, res) {
  return res.send(501);
};
