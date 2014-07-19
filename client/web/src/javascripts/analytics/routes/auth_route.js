Oa.AuthRoute = Em.Route.extend({
  beforeModel: function(transition) {
    var self = this;

    $.ajax(HOST + '/session?token=' + localStorage.token, {
      type: 'GET',
      headers: {
        'X-Auth-Token': localStorage.token
      }
    }).then(function(res) {
      
    }, function(res) {
      self.redirectToLogin(transition);
    });
  },

  redirectToLogin: function(transition) {
    this.transitionTo('login');
  }
});
