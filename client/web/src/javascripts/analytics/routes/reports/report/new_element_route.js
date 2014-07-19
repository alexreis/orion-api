Oa.ReportsReportNewElementRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    var reportId = this.controllerFor('reports.report').get('id');
    controller.set('reportId', reportId);

    controller.set('questionnaires', this.store.find('questionnaire'));
  },

  model: function() {
    return this.store.createRecord('element', {});
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.report.newElement').get('content');
      content.rollback();
    }
  }
});
