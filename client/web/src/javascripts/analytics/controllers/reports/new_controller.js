Oa.ReportsNewController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        self.transitionToRoute('reports');
      }, function(res) {
        window.alert('Erro ao salvar relatório');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('reports');
    }
  }
});
