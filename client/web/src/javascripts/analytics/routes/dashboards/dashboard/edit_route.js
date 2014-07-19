Oa.DashboardsDashboardEditRoute = Oa.AuthRoute.extend({
  renderTemplate: function() {
    this.render('outlets/edit_modal', {
      outlet: 'inside'
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    this.store.find('variable').then(function(variableOptions) {
      controller.set('variableOptions', variableOptions);

      var variables = model.get('variables');
      var selectedVariables = [];
      variables.forEach(function(d) {
        variableOptions.forEach(function(dd) {
          if (dd.get('name') === d) {
            dd.set('active', true);
            selectedVariables.push(dd);
          }
        });
      });

      controller.set('selectedVariables', selectedVariables);
    });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('dashboards.dashboard.edit').get('content');
      content.rollback();
    },

    openModal: function() {
      this.render('outlets/variables', {
        outlet: 'inside'
      });
    },

    closeModal: function() {
      this.render('outlets/edit_modal', {
        outlet: 'inside'
      });
    }
  }
});
