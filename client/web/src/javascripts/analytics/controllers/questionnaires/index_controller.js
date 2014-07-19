Oa.QuestionnairesIndexController = Em.ArrayController.extend({
  queryName: '',

  filteredQuestionnaires: function() {
    var reports = this.get('content');
    var queryName = this.get('queryName');

    var regex = new RegExp(queryName, 'i');

    return reports.filter(function(d) {
      if (regex.test(d.get('name')) === true) {
        return true;
      } 
      
    });

  }.property('content.@each', 'queryName')
});
