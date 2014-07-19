Oa.ReportsReportEditElementRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.report.editElement').get('content');
      content.rollback();
    }
  }
});
