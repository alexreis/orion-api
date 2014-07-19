Oa.ReportsRoute = Em.Route.extend({
  model: function() {
    return this.store.find('report');
  }
});
