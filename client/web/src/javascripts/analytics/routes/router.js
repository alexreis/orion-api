Oa.Router.map(function() {
  this.route('login', { path: '/' });
  this.route('logout');

this.resource('reports', { path: '/reports' }, function() {
      this.route('new');
      this.resource('reports.report', { path: ':report_id'}, function() {
        this.route('edit');

        this.route('newElement', { path: '/new_element' });
        this.route('editElement', { path: '/edit_element/:element_id' });
      });
    });

    this.resource('questionnaires', function() {
      this.route('new');

      this.resource('questionnaires.items', { path: '/items' }, function() {
        this.route('new');
        this.resource('questionnaires.items.item', { path: '/:item_id' }, function() {
          this.route('edit');
        });
      });

      this.resource('questionnaires.questionnaire', { path: '/:questionnaire_id' }, function() {
        this.route('edit');
      });
    });


  // this.resource('orion', { path: '/' }, function() {
    // Reports
    

    this.resource('dashboards', {path: '/d'}, function() {
      this.route('new');

      this.resource('dashboards.dashboard', { path: '/:dashboard_id' }, function() {
        this.resource('dashboards.dashboard.variable', { path: '/v/:variable_id/:from/:to' });
        this.route('edit');
      });
    });

    // this.resource('users', function() {
    //   this.route('new');
    //   this.resource('users.user', function() {
    //     this.route('edit');
    //   });
    // });
  // });

  // this.resource('form', { path: '/form/:questionnaire_id' }) // Instância de um questionário -->> Must be a separate ember app
});

Oa.Router.reopen({
  // location: 'none',
  rootURL: '/analytics/'
});
