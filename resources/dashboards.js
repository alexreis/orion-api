var async = require('async'),
    mongoose = require('mongoose');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

exports.find = function(req, res) {
  Dashboard.find({})
    .exec(function(err, dashboards) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send(200, { dashboards: dashboards });
    });
};

exports.findById = function(req, res) {
  var dashboardId = req.params.id;

  Dashboard.findById(dashboardId)
    .exec(function(err, dashboard) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send(200, { dashboard: dashboard });
    });
};

exports.createRecord = function(req, res) {
  var dashboard = new Dashboard({
    name: req.body.dashboard.name,
    description: req.body.dashboard.description,
    variables: req.body.dashboard.variables
  });

  dashboard.save(function(err) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send(200, { dashboard: dashboard });
  });
};

exports.updateRecord = function(req, res) {
  var dashboardId = req.params.id;

  Dashboard.findById(dashboardId)
    .exec(function(err, dashboard) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      dashboard.name = req.body.dashboard.name;
      dashboard.description = req.body.dashboard.description;
      dashboard.variables = req.body.dashboard.variables;

      dashboard.save(function(err) {
        if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

        return res.send(200, { dashboard: dashboard });
      });
    });
};

exports.deleteRecord = function(req, res) {
  return res.send(501);
};

exports.patchRecord = function(req, res) {
  return res.send(501);
};
