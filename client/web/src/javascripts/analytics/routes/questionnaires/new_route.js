Oa.QuestionnairesNewRoute = Em.Route.extend({
  model: function() {
    return this.store.createRecord('questionnaire', { });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('questionnaires.new').get('content');
      content.rollback();
    }
  }
});
