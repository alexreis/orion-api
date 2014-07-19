Oa.DashboardsDashboardVariableController = Em.Controller.extend({
  crossVariable: null,
  currentVariable: null,

  crossings: [
    { label: 'Região', value: 'REG' }
  ],

  watchCrossVariable: function() {
    var currentVariable = this.get('currentVariable'),
        crossVariable = this.get('crossVariable');

    $.ajax(HOST + '/v1/variables/crossings/' + currentVariable + '/' + crossVariable, {
      type: 'GET',
      headers: {
        'X-Auth-Token': localStorage.token
      }
    }).then(function(res) {
      console.log('success::watchCrossVariable', res);
    }, function(res) {
      console.log('error::watchCrossVariable', res);
    });

  }.observes('crossVariable'),

  screenWidth: function() {
    return window.screen.width - 20;
  }.property(),
  
  from: null,    
  detailsLinechart: null,
  detailsBarchart: null,

  actions: {
    showDetailsLinechart: function(d) {
      this.set('detailsLinechart', d);
    },

    showDetailsBarchart: function(d) {
      this.set('detailsBarchart', d);
    }
  }
});
