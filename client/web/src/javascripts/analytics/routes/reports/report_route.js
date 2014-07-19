Oa.ReportsReportRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    console.log('Oa.ReportsReportRoute' );
  },

  model: function(params) {
    return this.store.find('report', params.report_id);
  }
});
