Oa.DashboardsNewRoute = Oa.AuthRoute.extend({
  renderTemplate: function() {
    this.render('outlets/new_modal', {
      outlet: 'inside'
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    this.store.find('variable').then(function(res) {
      controller.set('variableOptions', res);
    });
  },

  model: function() {
    return this.store.createRecord('dashboard', {
      variables: []
    });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('dashboards.new').get('content');
      content.rollback();
    },

    openModal: function() {
      this.render('outlets/variables', {
        outlet: 'inside'
      });
    },

    closeModal: function() {
      this.render('outlets/new_modal', {
        outlet: 'inside'
      });
    }
  }
});
