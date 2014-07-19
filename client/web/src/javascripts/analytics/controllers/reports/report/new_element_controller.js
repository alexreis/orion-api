Oa.ReportsReportNewElementController = Em.ObjectController.extend({
  elementTypes: [
    { label: 'Diagrama de dispersão', value: 'scatterplot'},
    { label: 'Gráfico de barras', value: 'barchart'},
    { label: 'Gráfico de linhas', value: 'linechart'},
    { label: 'Histograma', value: 'histogram'},
    { label: 'Texto', value: 'text'}
  ],

  questionnaire: null,

  actions: {
    save: function() {
      var self = this,
          element = this.get('content');

      var reportId = this.get('reportId');

      this.store.find('report', reportId).then(function(report) {
        element.set('report', report);

        element.save().then(function(res) {
          window.alert('Elemento adicionado com sucesso.');
          self.transitionToRoute('reports.report');
        }, function(res) {
          window.alert('Erro ao adicionar elemento.');
        });

      }, function(res) {
        console.log('Erro ao adicionar elemento.');
      });

    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('reports.report');
    },

    addVariable: function(variable) {
      console.log('variable', variable);
    }
  }
});
