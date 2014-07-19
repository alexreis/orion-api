Oa.ReportsReportEditElementController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        window.alert('Elemento adicionado com sucesso.');
        self.transitionToRoute('reports.report');
      }, function(res) {
        window.alert('Erro ao adicionar elemento.');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('reports.report');
    },

    remove: function() {
      var self = this,
          content = this.get('content');

      content.destroyRecord().then(function(res) {
        window.alert('Elemento removido com sucesso');
        self.transitionToRoute('reports.report');
      }, function(res) {
        window.alert('Erro ao remover elemento.');
      });
    }
  }
});
