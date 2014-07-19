Oa.DashboardsDashboardEditController = Em.ObjectController.extend({
  variableOptions: [],
  selectedVariables: [],

  actions: {
    toggleVariable: function(variable) {
      var selectedVariables = this.get('selectedVariables');

      if (selectedVariables.contains(variable) === false) {
        variable.set('active', true);
        selectedVariables.pushObject(variable);
        console.log('add', variable);
      } else {
        variable.set('active', false);
        selectedVariables.removeObject(variable);
        console.log('remove', variable);
      }
    },

    save: function() {
      var self = this,
          content = this.get('content'),
          selectedVariables = this.get('selectedVariables');
      
      this.set('content.variables', []);
      var variables = this.get('content.variables');

      selectedVariables.forEach(function(d) {
        variables.pushObject(d.get('name'));
      });
      
      content.save().then(function(res) {
        self.transitionToRoute('dashboards.dashboard');
      }, function(res) {
        window.alert('Erro ao salvar dashboard');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('dashboards.dashboard');
    }
  }
});
