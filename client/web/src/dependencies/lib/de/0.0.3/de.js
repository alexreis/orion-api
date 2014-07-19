console.debug( '/*!\n * DE - D3 + Ember\n * Copyright 2014 Fabrício Tavares\n */' );
!function() {
  var DE = { version: '0.0.2' };

Ember.TEMPLATES['components/bar-chart'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  return buffer;
  
});


DE.ChartMixin = Em.Mixin.create({
  tagName: 'svg',
  classNames: ['de-chart'],
  attributeBindings: ['width', 'height'],
  svg: null,

  // Default dimension
  width: 960,
  height: 640,

  // Margin convention
  innerWidth: function() {
    var width = this.get('width'),
        margin = this.get('margin');

    return width - margin.left - margin.right;
  }.property('width', 'margin'),

  innerHeight: function() {
    var height = this.get('height'),
        margin = this.get('margin');

    return height - margin.top - margin.bottom;
  }.property('height', 'margin'),

  margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Default
  
  // Mandatory config properties
  name: null,
  colors: [],

  nextData: null,
  currentData: null,

  _start: function() {
    var svgId = '#' + this.$().attr('id'),
        innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight'),
        margin = this.get('margin'),
        config = this.get('config');

    this.set('name', config.name);

    var svg = d3.select(svgId)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.set('svg', svg);

    
    if (this.get('currentData') === null) {
      this.set('currentData', config.data);
    } else {
      this.set('nextData', config.data);
    }
  }
});
DE.TableMixin = Em.Mixin.create({
  _start: function() {

  }
});
DE.BarChartComponent = Em.Component.extend(DE.ChartMixin, {
  classNames: ['de-bar-chart'],

  // If you want to do animated transitions
  animate: function() {
    var currentData = this.get('currentData'),
        nextData = this.get('nextData');

  }.observes('currentData', 'nextData'),

  margin: { top: 40, right: 10, bottom: 30, left: 20 },

  _draw: function() {
    function wrap(text, width) {
      var width = 270;
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

    var type = this.get('config.type'),
        self = this;

    var innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight');

    var currentData = this.get('currentData'),
        svg = this.get('svg'),
        name = this.get('name'),
        colors = this.get('colors');


    if (type === 'barchart') {
      var xScale = d3.scale.linear().range([0, innerWidth]).domain([0, d3.max(currentData, function(d) { return d['x']; })]);

      var yScale = d3.scale.ordinal()
          .rangeRoundBands([0, innerHeight], .1);

      yScale.domain(currentData.map(function(d) { return d['y']; }));

          // Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('class', 'de-title')
      .text(name);

    var gChart = svg.append('g')
      .attr('class', 'g-chart')
      .attr('transform', 'translate(0,0)');

    gChart.append('g')
      .attr('class', 'de-axis')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(xAxis);

    gChart.append('g')
      .attr('class', 'de-axis')
      .attr('transform', 'translate(0,0)')
      .call(yAxis);

    var gBars = gChart.append('g').selectAll('.de-bars')
        .data(currentData)
      .enter().append('g')
        .attr('class', 'de-bars');

    gBars.append('rect')
        .attr('class', 'de-rect')
        .attr('y', function(d) { return yScale(d['y']); })
        .attr('width', function(d) { return xScale(d['x']); })
        .attr('height', yScale.rangeBand())
        .on('click', function(d) {
          d3.selectAll('.active-rect').classed('active-rect', false);
          d3.select(this).classed('active-rect', true);
          self.sendAction('action', d);
        });


    } else if (type === 'linechart') {
      // data: [
      //       {x: 9, y: 'masculino'},
      //       {x: 54, y: 'feminino'}
      //     ]

      var svgId = '#' + this.$().attr('id');
      var margin = this.get('margin.top') + this.get('margin.bottom');
      console.log( 'margin', margin );
      var newHeight = ((currentData.length * 30) + 300) - margin;
      console.log( 'newHeight', newHeight );
      console.log('linnerHeight', innerHeight);
      // d3.select(svgId).attr('height', innerHeight);

      var linechart2barchartData = [];

      currentData.forEach(function(d) {

        linechart2barchartData.push({x: d.values[0].value, y: d.name});
      });

      var xScale = d3.scale.linear().range([0, innerWidth]).domain([0, d3.max(linechart2barchartData, function(d) { return d['x']; })]);

      var yScale = d3.scale.ordinal()
          .rangeRoundBands([0, innerHeight], .1);

      yScale.domain(linechart2barchartData.map(function(d) { return d['y']; }));

          // Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('class', 'de-title')
      .text(name);

    var gChart = svg.append('g')
      .attr('class', 'g-chart')
      .attr('transform', 'translate(0,0)');

    gChart.append('g')
      .attr('class', 'de-axis')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(xAxis);

    

    var gBars = gChart.append('g').selectAll('.de-bars')
        .data(linechart2barchartData)
      .enter().append('g')
        .attr('class', 'de-bars');

    gBars.append('rect')
        .attr('class', 'de-rect')
        .attr('y', function(d) { return yScale(d['y']); })
        .attr('width', function(d) { return xScale(d['x']); })
        .attr('height', yScale.rangeBand())
        // .style('fill', colors[0])
        .on('click', function(d) {
          d3.selectAll('.active-rect').classed('active-rect', false);
          d3.select(this).classed('active-rect', true);
          self.sendAction('action', d);
        });

    gBars.append('text')
        .attr('y', function(d) { return yScale(d['y']) + (yScale.rangeBand() / 2); })
        .attr('x', function(d) {
            
            // console.log('scaled X', xScale(d.x));
            // console.log('X', d.x);
          return 240;
        })
        .text(function(d) {
          console.log('ddddd', d);

          return d.x + '%';
        });

      gChart.append('g')
      .attr('class', 'de-axis de-axis-y')
      .attr('transform', 'translate(20,0)')
      .call(yAxis)
    .selectAll(".tick text")
      .style('text-anchor', 'start')
      .call(wrap, yScale.rangeBand());

      // 
    }



  },

  didInsertElement: function() {
    this._start();
    this._draw();
  }
});
DE.LineChartComponent = Em.Component.extend(DE.ChartMixin, {
  classNames: ['de-line-chart'],

  // If you want to do animated transitions
  animate: function() {
    var currentData = this.get('currentData'),
        nextData = this.get('nextData');

  }.observes('currentData', 'nextData'),

  margin: { top: 40, right: 10, bottom: 30, left: 40 },

  _draw: function() {
    var self = this;
    var nDays = 4;
    var innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight');

    var currentData = this.get('currentData'),
        svg = this.get('svg'),
        name = this.get('name'),
        colors = this.get('colors');

    var format = d3.time.format('%Y-%m-%d');
    currentData.forEach(function(d) {
      nDays = d.values.length;
      console.log('nDays', d.values.length);
      d.values.forEach(function(d2) {
        d2.date = format.parse(d2.date);
      });
    });

    // ----------------------------------------------------------------------

    var x = d3.time.scale()
    .range([0, innerWidth - 70]);

  var y = d3.scale.linear()
    .range([innerHeight, 0]);

  // x.domain(d3.extent(currentData[0], function(d) {
  //   console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', d);
  //   return d.date;
  // }));

  x.domain([
    d3.min(currentData, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
    d3.max(currentData, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
  ]);

  y.domain([
    // d3.min(currentData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
    0,
    d3.max(currentData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
  ]);

var color = d3.scale.category20();

var xGridAxis = d3.svg.axis()
    .scale(x)
    .orient('top')
    .ticks(nDays)
    .tickSize(innerHeight, 0);

console.log('xGridAxis', xGridAxis.ticks());
var yGridAxis = d3.svg.axis()
    .scale(y)
    .orient('right')
    .ticks(4)
    .tickSize(innerWidth, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(nDays)
    .tickFormat(d3.time.format('%d/%m'));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(4)
    .tickFormat(function(d) { return d; });

var line = d3.svg.line()
    .interpolate('linear')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  svg.append('g')
      .attr('class', 'de-grid de-axis-grid')
      .attr('transform', 'translate(0,' + (innerHeight) + ')')
      .call(xGridAxis);

  svg.append('g')
      .attr('class', 'de-grid de-axis-grid')
      .attr('transform', 'translate(0, 0)')
      .call(yGridAxis);



    svg.append('g')
      .attr('class', 'de-axis')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(xAxis);

  svg.append('g')
      .attr('class', 'de-axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('');

  var oline = svg.selectAll('.de-lines')
      .data(currentData)
    .enter().append('g')
      .attr('class', 'de-lines');

  oline.append('path')
      .attr('class', function(d) {
        var a = d.name.replace(' ', '');
        a = a.replace('(', '');
        a = a.replace(')', '');
        a = a.replace('/', '');
        a = a.trim();
        return 'de-line l-' + a;
      })
      .attr('d', function(d) { return line(d.values); })
      .style('stroke', function(d) { return color(d.name); });

  oline.append('path')
      .attr('class', 'de-line-clickarea')
      .attr('d', function(d) { return line(d.values); })
      .style('stroke', 'transparent')
      .on('click', function(d) {
        d3.selectAll('.active-line').classed('active-line', false);
        var a = d.name.replace(' ', '');
        a = a.replace('(', '');
        a = a.replace(')', '');
        a = a.replace('/', '');
        a = a.trim();
        d3.select('.l-' + a).classed('active-line', true);
        self.sendAction('action', d);
      });

  oline.selectAll('.de-point')
      .data(function(d) {
        d.values.forEach(function(dd) {
          dd.name = d.name;
        });
        return d.values;
      })
    .enter().append('circle')
      .attr('class', 'de-point')
      .attr('cx', function(d) { return x(d.date);})
      .attr('cy', function(d) { return y(d.value);})
      .attr('r', 3)
      .style('fill', function(d) { return color(d.name); });

  oline.selectAll('.de-perc')
    .data(function(d) {
        d.values.forEach(function(dd) {
          dd.name = d.name;
        });
        return d.values;
      })
    .enter().append('text')
      .attr('class', 'de-perc')
      .attr('x', function(d) { return x(d.date) - 3; })
      .attr('y', function(d) { return y(d.value) - 6; })
      .text(function(d) { return d.value; });


  oline.append('text')
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr('transform', function(d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.value) + ')'; })
      .attr('x', 3)
      .attr('dy', '.35em')
      .text(function(d) { return d.name; });


  },

  didInsertElement: function() {
    this._start();
    this._draw();
  }
});
DE.TableChartComponent = Em.Component.extend(DE.TableMixin, {
  classNames: ['de-table-chart'],
  didInsertElement: function() {
    this._start();
    console.log( 'table-chart' );
  }
});

  if (typeof define === 'function' && define.amd) {
    define(DE);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = DE;
  } else {
    this.DE = DE;
  }
}();
