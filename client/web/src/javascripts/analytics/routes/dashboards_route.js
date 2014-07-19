Oa.DashboardsRoute = Oa.AuthRoute.extend({
  beforeModel: function(transition) {
    if (localStorage.token) {
    Oa.ApplicationAdapter.reopen({
      headers: {
        'X-Auth-Token': localStorage.token
      }
    });
    } else {
      this.transitionTo('login');
    }
  },

  model: function() {
    return this.store.find('dashboard');
  },

  actions: {
    logout: function() {
      localStorage.removeItem('token');
      // $.removeCookie('token');
      this.transitionTo('login');
    }
  }
});
