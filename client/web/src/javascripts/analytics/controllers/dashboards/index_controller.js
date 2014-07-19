Oa.DashboardsIndexController = Em.ArrayController.extend({
  queryName: '',

  filteredDashboards: function() {
    var dashboards = this.get('content');
    var queryName = this.get('queryName');

    var regex = new RegExp(queryName, 'i');

    return dashboards.filter(function(d) {
      if (regex.test(d.get('name')) === true) {
        return true;
      } 
      
    });

  }.property('content.@each', 'queryName')
});
