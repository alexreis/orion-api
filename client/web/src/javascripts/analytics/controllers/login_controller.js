Oa.LoginController = Em.Controller.extend({
  username: null,
  password: null,
  ok: false,
  actions: {
    enter: function() {
      var self = this;
      var username = this.get('username'),
          password = this.get('password');

      $.ajax(HOST + '/login', {
        type: 'POST',
        data: 'username=' + username + '&password=' + password
      }).then(function(res) {
        localStorage.token = res.token;

        self.transitionToRoute('dashboards');
        self.set('username', null);
        self.set('password', null);
        Oa.token = res.token;
        self.set('ok', true);
      }, function(res) {
        // console.log('falha');
      });
    }
  }
});
