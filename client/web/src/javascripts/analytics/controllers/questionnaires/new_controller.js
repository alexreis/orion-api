Oa.QuestionnairesNewController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        self.transitionToRoute('questionnaires');
      }, function(res) {
        window.alert('Erro ao salvar questionário');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('questionnaires');
    }
  }
});
