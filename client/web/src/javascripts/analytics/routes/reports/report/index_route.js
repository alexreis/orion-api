Oa.ReportsReportIndexRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    renderElement: function() {
      // this.render('outlets/current_element', {
      //   into: 'reports.report.index',
      //   outlet: 'currentElement'
      // });
    }
  }
});
