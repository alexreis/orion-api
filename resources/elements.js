var async = require('async'),
    mongoose = require('mongoose');

var Dashboard = mongoose.model('Dashboard'),
    Element = mongoose.model('Element'),
    Questionnaire = mongoose.model('Questionnaire'),
    Report = mongoose.model('Report'),
    Variable = mongoose.model('Variable');

exports.find = function(req, res) {

  if (req.query.ids !== undefined) {
    return findMany(req, res);
  } else {
    Element.find(req.query)
    .exec(function(err, elements) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send({ elements: elements });
    });
  }
};

function findMany(req, res) {
  Element.find({
    _id: {'$in': req.query.ids}
  })
  .exec(function(err, elements) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send({ elements: elements });
    });
};

exports.findById = function(req, res) {
  Element.findById(req.params.id)
    .exec(function(err, element) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      return res.send({ element: element });
    });
};

exports.createRecord = function(req, res) {
  async.waterfall([
    function(callback) {
      Element.count({report: req.body.element.report}, function(err, count) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        return callback(null, count);
      });
    },

    function(count, callback) {
      var element = new Element({
        title: req.body.element.title,
        elementType: req.body.element.elementType,
        position: count + 1,
        report: req.body.element.report
      });

      element.save(function(err) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        return callback(null, element);
      });
    }
  ], function(err, element) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send(200, { element: element });
  });
};

exports.updateRecord = function(req, res) {

  Element.findById(req.params.id)
    .exec(function(err, element) {
      if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

      element.title = req.body.element.title;

      element.save(function(err) {
        if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

        return res.send(200, { element: element });
      });
    });
};

exports.deleteRecord = function(req, res) {
  async.waterfall([
    function(callback) {
      Element.findById(req.params.id)
      .exec(function(err, element) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        return callback(null, element);
      });
    },

    function(element, callback) {
      Element.find({ position: {'$gt': element.position }})
        .exec(function(err, elements) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        async.each(elements, function(el, callback2) {
          el.position = el.position - 1;
          el.save(function(err) {
            if (err) return callback2({ error: { status: 500, message: 'Internal Server Error' }});

            return callback2(null);
          });
        }, function(err) {
          if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

          return callback(null, element);
        })
      });
    },

    function(element, callback) {
      element.remove(function(err) {
        if (err) return callback({ error: { status: 500, message: 'Internal Server Error' }});

        return callback(null);
      });
    }
  ], function(err, results) {
    if (err) return res.send(500, { error: { status: 500, message: 'Internal Server Error' }});

    return res.send(200, {});
  });
};

exports.patchRecord = function(req, res) {
  return res.send(501);
};
