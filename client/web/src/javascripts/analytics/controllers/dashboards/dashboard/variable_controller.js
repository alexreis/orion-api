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

  isCrossLoaded: true,
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

        // res.forEach(function(d) {
        //   var config = {
        //     type: 'linechart',
        //         name: '',
        //         width: 300,
        //         height: 500,
        //         colors: ['steelblue'],
        //         margin: { top: 40, right: 100, bottom: 30, left: 40 },
        //         scales: [
        //           { name: 'x', type: 'ordinal', range: 'width', domain: {'data': 'table', 'field': 'data.x'} },
        //           { name: 'y', range: 'height', nice: true, domain: {'data': 'table', 'field': 'data.y'} }
        //         ],
        //         axes: [
        //           {'type': 'x', 'scale': 'x'},
        //           {'type': 'y', 'scale': 'y'}
        //         ]
        //   };

        //   config.data = d;

        //   crossingDataset.pushObject(config);
        // });

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

  DUMMY: [
    {
      _id: 'EPPR2',
      name: 'EPPR2',
      title: 'Titulo qualquer',

      config: {
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
      },

      data: [
            {
                "name": "Aécio",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 10
                    },
                    {
                        "date": "2014-07-18",
                        "value": 10
                    }
                ]
            },
            {
                "name": "Dilma",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 22
                    },
                    {
                        "date": "2014-07-18",
                        "value": 21
                    }
                ]
            },
            {
                "name": "Eduardo",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 4
                    },
                    {
                        "date": "2014-07-18",
                        "value": 4
                    }
                ]
            },
            {
                "name": "Outros",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 6
                    },
                    {
                        "date": "2014-07-18",
                        "value": 6
                    }
                ]
            },
            {
                "name": "Ninguém",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 10
                    },
                    {
                        "date": "2014-07-18",
                        "value": 11
                    }
                ]
            },
            {
                "name": "NS",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 48
                    },
                    {
                        "date": "2014-07-18",
                        "value": 48
                    }
                ]
            },
            {
                "name": "NR",
                "values": [
                    {
                        "date": "2014-07-17",
                        "value": 0
                    },
                    {
                        "date": "2014-07-18",
                        "value": 0
                    }
                ]
            }
        ] 
    }
  ],

  actions: {
    showDetailsLinechart: function(d) {
      this.set('detailsLinechart', d);
    },

    showDetailsBarchart: function(d) {
      this.set('detailsBarchart', d);
    }
  }
});
