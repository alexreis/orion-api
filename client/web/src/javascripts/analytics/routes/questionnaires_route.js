Oa.QuestionnairesRoute = Em.Route.extend({
  model: function() {
    return this.store.find('questionnaire');
  }
});
