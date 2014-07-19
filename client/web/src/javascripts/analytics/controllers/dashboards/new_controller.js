Oa.DashboardsNewController = Em.ObjectController.extend({
  variableOptions: [],
  selectedVariables: [],

  actions: {
    toggleVariable: function(variable) {
      var selectedVariables = this.get('selectedVariables');

      if (selectedVariables.contains(variable) === false) {
        variable.set('active', true);
        selectedVariables.pushObject(variable);
      } else {
        variable.set('active', false);
        selectedVariables.removeObject(variable);
      }
    },

    save: function() {
      var self = this,
          content = this.get('content'),
          variables = this.get('content.variables'),
          selectedVariables = this.get('selectedVariables');
      
      selectedVariables.forEach(function(d) {
        variables.pushObject(d.get('name'));
      });

      content.save().then(function(res) {
        self.transitionToRoute('dashboards');
      }, function(res) {
        window.alert('Erro ao salvar dashboard');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('dashboards');
    }
  }
});
