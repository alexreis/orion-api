Oa.DashboardsDashboardIndexRoute = Oa.AuthRoute.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    var format = d3.time.format('%Y-%m-%d');

    // format(d3.time.day.offset(new Date(), -4)),

    var from = '2014-07-18',
        fromFAKE = '2014-07-17',
        to = format(new Date());
        to = d3.time.day.offset(format.parse(to), 1);

    // HERE BE DRAGONS
    var toFAKE = format(d3.time.day.offset(to, -2));

    controller.set('from', from);
    controller.set('fromFAKE', fromFAKE);
    controller.set('toFAKE', toFAKE);
  }
});
