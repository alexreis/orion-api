Oa.ReportsNewRoute = Em.Route.extend({
  model: function() {
    return this.store.createRecord('report', { });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.new').get('content');
      content.rollback();
    }
  }
});
