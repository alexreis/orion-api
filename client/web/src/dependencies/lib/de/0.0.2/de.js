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

  margin: { top: 40, right: 10, bottom: 30, left: 100 },

  _draw: function() {
    var innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight');

    var currentData = this.get('currentData'),
        svg = this.get('svg'),
        name = this.get('name'),
        colors = this.get('colors');


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
        .style('fill', colors[0]);

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

  margin: { top: 40, right: 10, bottom: 30, left: 100 },

  _draw: function() {
    var innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight');

    var currentData = this.get('currentData'),
        svg = this.get('svg'),
        name = this.get('name'),
        colors = this.get('colors');

    var format = d3.time.format('%Y-%m-%d');
    currentData.forEach(function(d) {
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

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(4)
    .tickFormat(d3.time.format('%d/%m'));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(function(d) { return d + '%'; });

var line = d3.svg.line()
    .interpolate('linear')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

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
      .text('Label Y');

  var oline = svg.selectAll('.de-lines')
      .data(currentData)
    .enter().append('g')
      .attr('class', 'de-lines');

  oline.append('path')
      .attr('class', 'de-line')
      .attr('d', function(d) { return line(d.values); })
      .style('stroke', function(d) { return color(d.name); });

  oline.selectAll('.de-point')
      .data(function(d) { return d.values; })
    .enter().append('circle')
      .attr('class', 'de-point')
      .attr('cx', function(d) { return x(d.date);})
      .attr('cy', function(d) { return y(d.value);})
      .attr('r', 3);

  oline.append('text')
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr('transform', function(d) { console.log('d.value.date', d.value.date);return 'translate(' + x(d.value.date) + ',' + y(d.value.value) + ')'; })
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
