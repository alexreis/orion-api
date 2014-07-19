Oa.DashboardsDashboardVariableController = Em.Controller.extend({
  crossVariable: null,
  currentVariable: null,

  crossings: [
    // { label: 'Região', value: 'REG' },
    
    { label: 'Zona residencial', value: 'ZONA' },
    { label: 'Sexo', value: 'SEXO' },
    { label: 'Idade categorizada', value: 'IDADEF' },
    { label: 'Nível de escolaridade', value: 'ESC' },
    { label: 'Pop. econom. ativa', value: 'PEA' },
    { label: 'Renda familiar', value: 'RENDAF' }
  ],

  watchCrossVariable: function() {
    var currentVariable = this.get('currentVariable'),
        crossVariable = this.get('crossVariable');

    var from = '2014-07-18',
        to = '2014-07-20';
        
    $.ajax(HOST + '/v1/variables/crossings/' + currentVariable + '/' + crossVariable + '/?from=' + from + '&to=' + to, {
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
