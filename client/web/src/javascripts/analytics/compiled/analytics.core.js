window.Oa = Em.Application.create({
  rootElement: '#orion-analytics',
  token: null
});

Oa = $.extend(Oa, DE);

var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

};
Oa.DashboardsController = Em.ArrayController.extend();
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
Oa.MeController = Em.ObjectController.extend();
Oa.ReportsController = Em.ArrayController.extend();
Oa.DashboardsDashboardController = Em.ObjectController.extend();
Oa.DashboardsIndexController = Em.ArrayController.extend({
  queryName: '',

  filteredDashboards: function() {
    var dashboards = this.get('content');
    var queryName = this.get('queryName');

    var regex = new RegExp(queryName, 'i');

    return dashboards.filter(function(d) {
      if (regex.test(d.get('name')) === true) {
        return true;
      } 
      
    });

  }.property('content.@each', 'queryName')
});
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
Oa.QuestionnairesIndexController = Em.ArrayController.extend({
  queryName: '',

  filteredQuestionnaires: function() {
    var reports = this.get('content');
    var queryName = this.get('queryName');

    var regex = new RegExp(queryName, 'i');

    return reports.filter(function(d) {
      if (regex.test(d.get('name')) === true) {
        return true;
      } 
      
    });

  }.property('content.@each', 'queryName')
});
Oa.QuestionnairesNewController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        self.transitionToRoute('questionnaires');
      }, function(res) {
        window.alert('Erro ao salvar questionário');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('questionnaires');
    }
  }
});
Oa.ReportsIndexController = Em.ArrayController.extend({
  queryName: '',

  filteredReports: function() {
    var reports = this.get('content');
    var queryName = this.get('queryName');

    var regex = new RegExp(queryName, 'i');

    return reports.filter(function(d) {
      if (regex.test(d.get('name')) === true) {
        return true;
      } 
      
    });

  }.property('content.@each', 'queryName')
});
Oa.ReportsNewController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        self.transitionToRoute('reports');
      }, function(res) {
        window.alert('Erro ao salvar relatório');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('reports');
    }
  }
});
Oa.ReportsReportController = Em.ObjectController.extend();
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
Oa.DashboardsDashboardIndexController = Em.ObjectController.extend({
  from: null,
  toFAKE: null,
  to: function() {
    var toFAKE = this.get('toFAKE');

    var format = d3.time.format('%Y-%m-%d');

    toFAKE = format.parse(toFAKE);

    var to = d3.time.day.offset(toFAKE, 2);

    return format(to);

  }.property('toFAKE')
});
Oa.DashboardsDashboardVariableController = Em.Controller.extend({
  crossVariable: null,
  currentVariable: null,

  crossingsOptions: [
    { label: 'Zona residencial', value: 'ZONA' },
    { label: 'Sexo', value: 'SEXO' },
    { label: 'Idade categorizada', value: 'IDADEF' },
    { label: 'Nível de escolaridade', value: 'ESC' },
    { label: 'Pop. econom. ativa', value: 'PEA' },
    { label: 'Renda familiar', value: 'RENDAF' }
  ],

  isCrossLoaded: false,
  crossingDataset: [],

  watchCrossVariable: function() {
    var self = this,
        currentVariable = this.get('currentVariable'),
        crossVariable = this.get('crossVariable')
        crossingDataset = this.get('crossingDataset');

    var format = d3.time.format('%Y-%m-%d');

    if (crossVariable !== null) {
      var from = '2014-07-18', // from deve ser fixo. A série começa aqui.
          to = format(d3.time.day.offset(new Date(), 1)); // tem que ser data do dia, + 1: new Date()

      $.ajax(HOST + '/v1/variables/crossings/' + currentVariable + '/' + crossVariable + '/?from=' + from + '&to=' + to, {
        type: 'GET',
        headers: {
          'X-Auth-Token': localStorage.token
        }
      }).then(function(res) {
        console.log('success::watchCrossVariable', res);

        // Aqui é necessário atualizar a array crossingDataset, mas antes é 
        // preciso fazer uma transformação nos dados, para que o Ember Component
        // dos gráficos reconheçam e renderizem os gráficos.
        //
        // A transformação que deve ser feita é:
        // "apendar" cada dataset, de forma separada, à var config. Depois jogar
        // tudo pra dentro da array crossingDataset.
        //

        self.set('crossingDataset', []);

        res.forEach(function(d) {
          var config = {
            type: 'linechart',
                name: '',
                width: 300,
                height: 500,
                colors: ['steelblue'],
                margin: { top: 40, right: 100, bottom: 30, left: 40 },
                scales: [
                  { name: 'x', type: 'ordinal', range: 'width', domain: {'data': 'table', 'field': 'data.x'} },
                  { name: 'y', range: 'height', nice: true, domain: {'data': 'table', 'field': 'data.y'} }
                ],
                axes: [
                  {'type': 'x', 'scale': 'x'},
                  {'type': 'y', 'scale': 'y'}
                ]
          };

          config.data = d;

          crossingDataset.push(config);
        });

        self.set('isCrossLoaded', true);
      }, function(res) {
        self.set('isCrossLoaded', false);
      });
    } else {
      self.set('isCrossLoaded', false);
    }
  }.observes('crossVariable'),

  

  screenWidth: function() {
    return window.screen.width - 20;
  }.property(),
  
  from: null,    
  detailsLinechart: null,
  detailsBarchart: null,

  actions: {
    showDetailsLinechart: function(d) {
      this.set('detailsLinechart', d);
    },

    showDetailsBarchart: function(d) {
      this.set('detailsBarchart', d);
    }
  }
});
Oa.ReportsReportEditController = Em.ObjectController.extend({
  actions: {
    save: function() {
      var self = this,
          content = this.get('content');
      
      content.save().then(function(res) {
        self.transitionToRoute('reports');
      }, function(res) {
        window.alert('Erro ao salvar relatório');
      });
    },

    cancel: function() {
      var self = this,
          content = this.get('content');

      content.rollback();
      self.transitionToRoute('reports.report');
    }
  }
});
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
Oa.ReportsReportIndexController = Em.ObjectController.extend({
  elements: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['position'],
      content: this.get('content.elements')
    });
  }).property('content.elements'),

  currentElementPosition: function() {
    return this.get('currentElementIndex') + 1;
  }.property('currentElementIndex'),

  currentElementIndex: 0,

  isLastElement: false,

  actions: {
    previousElement: function() {
      console.log('previousElement' );
      var position = this.get('currentElementIndex');

      if (position > 0) {
        this.decrementProperty('currentElementIndex');
      }
    },

    nextElement: function() {
      console.log('nextElement' );

      var n = this.get('elements').get('length');
      var currentElementIndex = this.get('currentElementIndex');

      if (currentElementIndex + 1 < n) {
        this.incrementProperty('currentElementIndex');
        this.set('isLastElement', false);
      } else {
        this.set('isLastElement', true);
      }
      
      this.send('renderElement');
    }
  }
});
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
Ember.Handlebars.registerBoundHelper('date', function(date, specifier) {
  if (arguments.length === 2) specifier = '%Y-%m-%d';

  return Object.prototype.toString.call(date) === '[object Date]' ? d3.time.format(specifier)(date) : specifier;
});
Ember.Handlebars.registerBoundHelper('slice', function(string, characters) {
  var slicedString = string.slice(0, characters);

  if (slicedString !== string) {
    return slicedString + '...'
  } else {
    return string;
  }
});
Oa.Dashboard = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  variables: DS.attr('array')
});
Oa.Element = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  title: DS.attr('string'),
  elementType: DS.attr('string'),
  position: DS.attr('number'),
  report: DS.belongsTo('report')

  // // Data
  // data: DS.attr('raw'),

  // // Labels
  // xLabel: DS.attr('string'),
  // yLabel: DS.attr('string'),

  // // Size
  // width: DS.attr('number'),
  // height: DS.attr('number')
});
Oa.Item = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  type: DS.attr('string'),
  questionnaire: DS.belongsTo('questionnaire')
});
Oa.Questionnaire = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  variables: DS.attr('array'),
  items: DS.hasMany('item', { async: true })
});
Oa.Report = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  elements: DS.hasMany('element', { async: true })
});
Oa.User = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string')
});
Oa.Variable = DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string'),
  data: DS.attr('array')
});
Oa.ApplicationRoute = Em.Route.extend({
  setupController: function(controller, model) {
    // $.getJSON('/api/users/actions/logged_user.php').then(function(res) {
    //   controller.set('username', res.user.name);
    // }, function(res) {
    // });
  }
});
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
Oa.OrionRoute = Em.Route.extend();
Oa.QuestionnairesRoute = Em.Route.extend({
  model: function() {
    return this.store.find('questionnaire');
  }
});
Oa.ReportsRoute = Em.Route.extend({
  model: function() {
    return this.store.find('report');
  }
});
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
Oa.DashboardsDashboardRoute = Oa.AuthRoute.extend();
Oa.DashboardsIndexRoute = Oa.AuthRoute.extend();
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
Oa.QuestionnairesIndexRoute = Em.Route.extend();
Oa.QuestionnairesItemsRoute = Em.Route.extend();
Oa.QuestionnairesNewRoute = Em.Route.extend({
  model: function() {
    return this.store.createRecord('questionnaire', { });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('questionnaires.new').get('content');
      content.rollback();
    }
  }
});
Oa.QuestionnairesQuestionnaireRoute = Em.Route.extend();
Oa.ReportsIndexRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    console.log('Oa.ReportsIndexRoute' );
  }
});
Oa.ReportsNewRoute = Em.Route.extend({
  model: function() {
    return this.store.createRecord('report', { });
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.new').get('content');
      content.rollback();
    }
  }
});
Oa.ReportsReportRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    console.log('Oa.ReportsReportRoute' );
  },

  model: function(params) {
    return this.store.find('report', params.report_id);
  }
});
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
Oa.DashboardsDashboardIndexRoute = Oa.AuthRoute.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    var format = d3.time.format('%Y-%m-%d');

    // format(d3.time.day.offset(new Date(), -4)),

    var from = '2014-07-18',
        fromFAKE = '2014-07-17',
        to = format(new Date());
        to = d3.time.day.offset(format.parse(to), 1);

    // HERE BE DRAGONS
    var toFAKE = format(d3.time.day.offset(to, -2));

    controller.set('from', from);
    controller.set('fromFAKE', fromFAKE);
    controller.set('toFAKE', toFAKE);
  }
});
Oa.DashboardsDashboardVariableRoute = Oa.AuthRoute.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('currentVariable', model._id);

    controller.set('detailsLinechart', null);
    controller.set('detailsBarchart', null);
    
    var from = model.data[0].values[0].date;
    var format = d3.time.format('%Y-%m-%d');
    var format2 = d3.time.format('%d/%m/%Y');
    from = format2(format.parse(from));
    controller.set('from', from);

    var dim = model.data[0].values.length;
    switch(dim) {
      case 0:
        controller.set('isValid', false);
        controller.set('isBarchart', false);
        break;
      case 1:
        controller.set('isValid', true);
        controller.set('isBarchart', true);
        break;
      default:
        controller.set('isValid', true);
        controller.set('isBarchart', false);
        break;
    }
  },

  model: function(params) {
    var self = this,
        store = this.store;

    return $.ajax(HOST + '/v1/variables/' + params.variable_id + '?from=' + params.from + '&to=' + params.to, {
      type: 'GET',
      headers: {
        'X-Auth-Token': localStorage.token
      }
    }).then(function(payload) {

      var config = {
      type: 'linechart',
          name: '',
          width: 300,
          height: 500,
          colors: ['steelblue'],
          margin: { top: 40, right: 100, bottom: 30, left: 40 },
          scales: [
            { name: 'x', type: 'ordinal', range: 'width', domain: {'data': 'table', 'field': 'data.x'} },
            { name: 'y', range: 'height', nice: true, domain: {'data': 'table', 'field': 'data.y'} }
          ],
          axes: [
            {'type': 'x', 'scale': 'x'},
            {'type': 'y', 'scale': 'y'}
          ]
    };

    config.data = payload.variable.data;

    payload.variable.config = config;

    return payload.variable;

    });
  }
});
Oa.QuestionnairesItemsIndexRoute = Em.Route.extend();
Oa.QuestionnairesQuestionnaireEditRoute = Em.Route.extend();
Oa.QuestionnairesQuestionnaireIndexRoute = Em.Route.extend();
Oa.ReportsReportEditElementRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.report.editElement').get('content');
      content.rollback();
    }
  }
});
Oa.ReportsReportEditRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.report.edit').get('content');
      content.rollback();
    }
  }
});
Oa.ReportsReportIndexRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    renderElement: function() {
      // this.render('outlets/current_element', {
      //   into: 'reports.report.index',
      //   outlet: 'currentElement'
      // });
    }
  }
});
Oa.ReportsReportNewElementRoute = Em.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    var reportId = this.controllerFor('reports.report').get('id');
    controller.set('reportId', reportId);

    controller.set('questionnaires', this.store.find('questionnaire'));
  },

  model: function() {
    return this.store.createRecord('element', {});
  },

  actions: {
    willTransition: function() {
      var content = this.controllerFor('reports.report.newElement').get('content');
      content.rollback();
    }
  }
});
// window.HOST = 'http://192.34.56.106';
window.HOST = 'http://localhost:3080';

Oa.ApplicationAdapter = DS.RESTAdapter.extend();

Oa.ApplicationAdapter.reopen({
  pathForType: function(type) {
    var underscored = Ember.String.underscore(type)
    return Ember.String.pluralize(underscored);
  },

  namespace: 'v1',
  host: 'http://localhost:3080',
  // host: 'http://192.34.56.106',
  // host: 'http://api.orion.voxdobrasil.com:3080',

  headers: {
    'X-Auth-Token': localStorage.token
  }
});

DS.JSONSerializer.reopen({
  primaryKey: '_id'
});

Oa.RawTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

Oa.ArrayTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

Oa.IsodateTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    var format = d3.time.format.iso;
    return format.parse(serialized);
  },
  serialize: function(deserialized) {
    var format = d3.time.format.iso;
    return format.parse(deserialized);
  }
});

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['dashboards'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "inside", options) : helperMissing.call(depth0, "outlet", "inside", options))));
  return buffer;
  
});

Ember.TEMPLATES['login'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<header class=\"bar bar-nav\">\n  <h1 class=\"title\">Login</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n  <form>\n    ");
  hashContexts = {'type': depth0,'value': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'placeholder': "STRING"};
  options = {hash:{
    'type': ("text"),
    'value': ("username"),
    'placeholder': ("Nome de usuário")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    ");
  hashContexts = {'type': depth0,'value': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'placeholder': "STRING"};
  options = {hash:{
    'type': ("password"),
    'value': ("password"),
    'placeholder': ("Senha")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  \n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "enter", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block\">Entrar</button>\n  </form>\n  </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['orion'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['questionnaires'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['reports'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['reports/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n        <li class=\"table-view-cell\">\n          ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navigate-right")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.report", "report", options) : helperMissing.call(depth0, "link-to", "reports.report", "report", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        ");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n            <span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, "report.createdAt", "%Y-%m-%d", options) : helperMissing.call(depth0, "date", "report.createdAt", "%Y-%m-%d", options))));
  data.buffer.push("</span>\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "report.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-left-nav pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "orion.index", options) : helperMissing.call(depth0, "link-to", "orion.index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-compose pull-right")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.new", options) : helperMissing.call(depth0, "link-to", "reports.new", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  <h1 class=\"title\">Relatórios</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n    ");
  hashContexts = {'type': depth0,'value': depth0,'tabindex': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'tabindex': "STRING"};
  options = {hash:{
    'type': ("search"),
    'value': ("queryName"),
    'tabindex': ("1")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    </form>\n\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "report", "in", "filteredReports", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n      </ul>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['reports/new'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<header class=\"bar bar-nav\">\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n  <h1 class=\"title\">Novo relatório</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n    ");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Nome"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    ");
  hashContexts = {'placeholder': depth0,'value': depth0,'rows': depth0};
  hashTypes = {'placeholder': "STRING",'value': "ID",'rows': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'placeholder': ("Descrição"),
    'value': ("description"),
    'rows': ("5")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['reports/report'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['reports/report/edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("Novo elemento");
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n\n    <h1 class=\"title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h1>\n  </header>\n\n  <div class=\"content\">\n    <div class=\"content-padded\">\n      <form>\n        ");
  hashContexts = {'type': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        ");
  hashContexts = {'value': depth0,'rows': depth0};
  hashTypes = {'value': "ID",'rows': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'value': ("description"),
    'rows': ("5")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        \n      </form>\n    </div>\n  </div>\n\n  <div class=\"bar bar-standard bar-footer\">\n    ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("btn btn-block")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.report.newElement", options) : helperMissing.call(depth0, "link-to", "reports.report.newElement", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </div>");
  return buffer;
  
});

Ember.TEMPLATES['reports/report/edit_element'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<header class=\"bar bar-nav\">\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n\n    <h1 class=\"title\">Edição elemento</h1>\n  </header>\n\n  <div class=\"content\">\n    <div class=\"content-padded\">\n      <form>\n        ");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Título do elemento"),
    'value': ("title")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </form>\n    </div>\n  </div>\n\n  <div class=\"bar bar-standard bar-footer\">\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block\">Remover</button>\n  </div>");
  return buffer;
  
});

Ember.TEMPLATES['reports/report/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n          <li>[ ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "element.position", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" | ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "element.elementType", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ] ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "element.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" (");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.report.editElement", "element", options) : helperMissing.call(depth0, "link-to", "reports.report.editElement", "element", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push(")</li>\n          ");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("Editar");
  }

function program6(depth0,data) {
  
  
  data.buffer.push("\n        <span class=\"icon icon-left\"></span>\n      ");
  }

function program8(depth0,data) {
  
  
  data.buffer.push("\n      <span class=\"icon icon-right\"></span>\n      ");
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n    ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-left-nav pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.index", options) : helperMissing.call(depth0, "link-to", "reports.index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-edit pull-right")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "reports.report.edit", options) : helperMissing.call(depth0, "link-to", "reports.report.edit", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    <h1 class=\"title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h1>\n  </header>\n\n  <div class=\"content\">\n    <div class=\"content-padded\">\n      <p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n\n        \n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "currentElement", options) : helperMissing.call(depth0, "outlet", "currentElement", options))));
  data.buffer.push("\n        <ul>\n          ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "element", "in", "elements", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </ul>\n\n\n    </div>\n  </div>\n\n  <nav class=\"bar bar-tab\">\n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "previousElement", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"tab-item active\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "currentElementIndex", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </a>\n    <a class=\"tab-item\">\n      [ ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "currentElementPosition", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" / ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "elements.length", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ]\n    </a>\n    \n\n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "nextElement", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"tab-item\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.unless.call(depth0, "isLastElement", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </a>\n    \n    \n  </nav>");
  return buffer;
  
});

Ember.TEMPLATES['reports/report/new_element'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n        <li class=\"table-view-cell\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "variable", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addVariable", "variable", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn\">+</button></li>\n        ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n\n  <h1 class=\"title\">Novo elemento</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n      ");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Título do elemento"),
    'value': ("title")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n\n      ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("elementTypes"),
    'optionValuePath': ("content.value"),
    'optionLabelPath': ("content.label"),
    'prompt': ("Selecione um elemento"),
    'value': ("elementType")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n      ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("questionnaires"),
    'optionValuePath': ("content"),
    'optionLabelPath': ("content.name"),
    'prompt': ("Selecione um questionário"),
    'value': ("questionnaire")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n      <ul class=\"table-view\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "variable", "in", "questionnaire.variables", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n      </ul>\n\n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['questionnaires/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n        <li class=\"table-view-cell\">\n          ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navigate-right")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "questionnaires.questionnaire", "questionnaire", options) : helperMissing.call(depth0, "link-to", "questionnaires.questionnaire", "questionnaire", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        ");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "questionnaire.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-left-nav pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "orion.index", options) : helperMissing.call(depth0, "link-to", "orion.index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-compose pull-right")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "questionnaires.new", options) : helperMissing.call(depth0, "link-to", "questionnaires.new", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  <h1 class=\"title\">Questionários</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n    ");
  hashContexts = {'type': depth0,'value': depth0,'tabindex': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'tabindex': "STRING"};
  options = {hash:{
    'type': ("search"),
    'value': ("queryName"),
    'tabindex': ("1")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    </form>\n\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "questionnaire", "in", "filteredQuestionnaires", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n      </ul>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['questionnaires/items'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['questionnaires/new'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<header class=\"bar bar-nav\">\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n  <h1 class=\"title\">Novo questionário</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n    ");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Nome"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['questionnaires/questionnaire'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  
});

Ember.TEMPLATES['questionnaires/questionnaire/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("index.hbs");
  
});

Ember.TEMPLATES['questionnaires/items/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("index.hbs");
  
});

Ember.TEMPLATES['outlets/edit_modal'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <li class=\"table-view-cell\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "variable.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </li>\n    ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n\n  <h1 class=\"title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n      ");
  hashContexts = {'type': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      ");
  hashContexts = {'value': depth0,'rows': depth0};
  hashTypes = {'value': "ID",'rows': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'value': ("description"),
    'rows': ("5")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        \n       <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "openModal", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block\">Variáveis</button>\n\n    <ul class=\"table-view\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "variable", "in", "selectedVariables", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </ul>\n    \n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['outlets/new_modal'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <li class=\"table-view-cell\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "variable.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </li>\n    ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-left\">Cancelar</button>\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn pull-right\">Salvar</button>\n  <h1 class=\"title\">Novo dashboard</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <form>\n    ");
  hashContexts = {'type': depth0,'placeholder': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'placeholder': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'placeholder': ("Nome"),
    'value': ("name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    ");
  hashContexts = {'placeholder': depth0,'value': depth0,'rows': depth0};
  hashTypes = {'placeholder': "STRING",'value': "ID",'rows': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'placeholder': ("Descrição"),
    'value': ("description"),
    'rows': ("5")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "openModal", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block\">Variáveis</button>\n\n    <ul class=\"table-view\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "variable", "in", "selectedVariables", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </ul>\n    \n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['outlets/variables'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n      <li class=\"table-view-cell\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "variable.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        <div ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleVariable", "variable", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': (":toggle variable.active:active")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("><div class=\"toggle-handle\"></div></div>\n      </li>\n    ");
  return buffer;
  }

  data.buffer.push("<div class=\"modal active\">\n  <header class=\"bar bar-nav\">\n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeModal", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"icon icon-close pull-right\"></a>\n    <h1 class=\"title\">Variáveis</h1>\n  </header>\n\n  <div class=\"content\">\n    <ul class=\"table-view\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "variable", "in", "variableOptions", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </ul>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['orion/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n            Dashboards\n          ");
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  <h1 class=\"title\">\n    <a href=\"/\">Orion</a>\n  </h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        <li class=\"table-view-cell\">\n          ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navigate-right")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboards", options) : helperMissing.call(depth0, "link-to", "dashboards", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        \n        ");
  data.buffer.push("\n          ");
  data.buffer.push("\n            ");
  data.buffer.push("\n          ");
  data.buffer.push("\n        ");
  data.buffer.push("\n        ");
  data.buffer.push("\n          ");
  data.buffer.push("\n            ");
  data.buffer.push("\n          ");
  data.buffer.push("\n        ");
  data.buffer.push("\n\n        ");
  data.buffer.push("\n      </ul>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['dashboards/dashboard'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "inside", options) : helperMissing.call(depth0, "outlet", "inside", options))));
  return buffer;
  
});

Ember.TEMPLATES['dashboards/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n        <li class=\"table-view-cell\">\n          ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navigate-right")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboards.dashboard", "dashboard", options) : helperMissing.call(depth0, "link-to", "dashboards.dashboard", "dashboard", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "dashboard.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  ");
  data.buffer.push("\n  ");
  data.buffer.push("\n  <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "logout", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"icon icon-close pull-right\"></a>\n  <h1 class=\"title\">Dashboards</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    ");
  data.buffer.push("\n\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "dashboard", "in", "filteredDashboards", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </ul>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['dashboards/new'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  return buffer;
  
});

Ember.TEMPLATES['dashboards/dashboard/edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  return buffer;
  
});

Ember.TEMPLATES['dashboards/dashboard/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n        <li class=\"table-view-cell\">\n          ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("navigate-right")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0,depth0],types:["STRING","ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboards.dashboard.variable", "variable.name", "from", "to", options) : helperMissing.call(depth0, "link-to", "dashboards.dashboard.variable", "variable.name", "from", "to", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        </li>\n        ");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n            ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "variable.title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-left-nav pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboards.index", options) : helperMissing.call(depth0, "link-to", "dashboards.index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  ");
  data.buffer.push("\n  <h1 class=\"title\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h1>\n</header>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <p>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n\n    <div class=\"card\">\n      <form class=\"input-group\">\n  ");
  data.buffer.push("\n    ");
  data.buffer.push("\n    ");
  data.buffer.push("\n  ");
  data.buffer.push("\n  <div class=\"input-row\">\n    <label>Até</label>\n    ");
  hashContexts = {'type': depth0,'value': depth0,'placeholder': depth0};
  hashTypes = {'type': "STRING",'value': "ID",'placeholder': "STRING"};
  options = {hash:{
    'type': ("date"),
    'value': ("toFAKE"),
    'placeholder': ("Até")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  </div>\n  </form>\n\n  </div>\n  <div class=\"card\">\n      <ul class=\"table-view\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "variable", "in", "variables", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n      </ul>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['dashboards/dashboard/variable'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '';
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    \n\n    ");
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "dataset", "in", "crossingDataset", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n\n    ");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n\n      ");
  data.buffer.push("\n        ");
  data.buffer.push("\n      ");
  data.buffer.push("\n        ");
  data.buffer.push("\n      ");
  data.buffer.push("\n\n    ");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push(" ");
  data.buffer.push("\n    \n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isBarchart", {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    \n\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "detailsLinechart", {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "detailsBarchart", {hash:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n      ");
  hashContexts = {'action': depth0,'config': depth0,'width': depth0,'height': depth0,'colors': depth0};
  hashTypes = {'action': "STRING",'config': "ID",'width': "ID",'height': "ID",'colors': "ID"};
  options = {hash:{
    'action': ("showDetailsBarchart"),
    'config': ("model.config"),
    'width': ("screenWidth"),
    'height': ("model.config.height"),
    'colors': ("model.config.colors")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bar-chart'] || depth0['bar-chart']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bar-chart", options))));
  data.buffer.push("\n    ");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n      ");
  hashContexts = {'action': depth0,'config': depth0,'width': depth0,'height': depth0,'colors': depth0};
  hashTypes = {'action': "STRING",'config': "ID",'width': "ID",'height': "ID",'colors': "ID"};
  options = {hash:{
    'action': ("showDetailsLinechart"),
    'config': ("model.config"),
    'width': ("screenWidth"),
    'height': ("model.config.height"),
    'colors': ("model.config.colors")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['line-chart'] || depth0['line-chart']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "line-chart", options))));
  data.buffer.push("\n    ");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        <li class=\"table-view-cell table-view-divider\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "detailsLinechart.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item", "in", "detailsLinechart.values", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </ul>\n    </div>\n    ");
  return buffer;
  }
function program12(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n        <li class=\"table-view-cell\">\n          <span class=\"pull-left\">");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, "item.date", "%d/%m/%Y", options) : helperMissing.call(depth0, "date", "item.date", "%d/%m/%Y", options))));
  data.buffer.push("</span>\n          <span class=\"pull-right\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.value", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("%</span>\n        </li>\n        ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"card\">\n      <ul class=\"table-view\">\n        <li class=\"table-view-cell table-view-divider\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "detailsBarchart.y", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n        <li class=\"table-view-cell\">\n          <span class=\"pull-left\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "from", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n          <span class=\"pull-right\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "detailsBarchart.x", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("%</span>\n        </li>\n      </ul>\n    </div>\n    ");
  return buffer;
  }

  data.buffer.push("<header class=\"bar bar-nav\">\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("icon icon-left-nav pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboards.dashboard.index", options) : helperMissing.call(depth0, "link-to", "dashboards.dashboard.index", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  <h1 class=\"title\">");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["ID","INTEGER"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.slice || depth0.slice),stack1 ? stack1.call(depth0, "model.title", 26, options) : helperMissing.call(depth0, "slice", "model.title", 26, options))));
  data.buffer.push("</h1>\n</header>\n\n");
  data.buffer.push("\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("crossingsOptions"),
    'optionValuePath': ("content.value"),
    'optionLabelPath': ("content.label"),
    'prompt': ("Cruzamentos"),
    'value': ("crossVariable")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "isCrossLoaded", {hash:{},inverse:self.program(6, program6, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});


