Oa.DashboardsDashboardVariableRoute = Oa.AuthRoute.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('currentVariable', model._id);
    console.log('model.id', model._id);

    controller.set('detailsLinechart', null);
    controller.set('detailsBarchart', null);
    
    var from = model.data[0].values[0].date;
    var format = d3.time.format('%Y-%m-%d');
    var format2 = d3.time.format('%d/%m/%Y');
    from = format2(format.parse(from));
    controller.set('from', from);

    var dim = model.data[0].values.length;
    switch(dim) {
      case 0:
        controller.set('isValid', false);
        controller.set('isBarchart', false);
        break;
      case 1:
        controller.set('isValid', true);
        controller.set('isBarchart', true);
        break;
      default:
        controller.set('isValid', true);
        controller.set('isBarchart', false);
        break;
    }
  },

  model: function(params) {
    var self = this,
        store = this.store;

    return $.ajax(HOST + '/v1/variables/' + params.variable_id + '?from=' + params.from + '&to=' + params.to, {
      type: 'GET',
      headers: {
        'X-Auth-Token': localStorage.token
      }
    }).then(function(payload) {

      var config = {
      type: 'linechart',
          name: '',

          width: 300,
          height: 500,

          colors: ['steelblue'],
          margin: { top: 40, right: 100, bottom: 30, left: 40 },

          scales: [
            {
              name: 'x',
              type: 'ordinal',
              range: 'width',
              domain: {'data': 'table', 'field': 'data.x'}
            },

            {
              name: 'y',
              range: 'height',
              nice: true,
              domain: {'data': 'table', 'field': 'data.y'}
            }
          ],

          axes: [
            {'type': 'x', 'scale': 'x'},
            {'type': 'y', 'scale': 'y'}
          ]
    };

    config.data = payload.variable.data;

    payload.variable.config = config;

    return payload.variable;

    });
  }
});
