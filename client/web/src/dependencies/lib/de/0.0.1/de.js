console.debug( '/*!\n * DE - D3 + Ember\n * Copyright 2014 Fabrício Tavares\n */' );
!function() {
  var DE = { version: '0.0.1' };

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

        console.log('width', width);
        console.log('margin', margin);
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

  _draw: function() {
    var innerWidth = this.get('innerWidth'),
        innerHeight = this.get('innerHeight');

    var currentData = this.get('currentData'),
        svg = this.get('svg');

        console.log(d3.max(currentData, function(d) { return d['x']; }) );
    var xScale = d3.scale.linear().range([0, innerWidth]).domain([0, d3.max(currentData, function(d) { return d['x']; })]);

    var yScale = d3.scale.ordinal()
        .rangeRoundBands([0, innerHeight], .1);

    yScale.domain(currentData.map(function(d) { return d['y']; }));

    console.log(xScale(3) );

    // Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');


    var gChart = svg.append('g')
      .attr('class', 'g-chart')
      .attr('transform', 'translate(100,0)');

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
        .attr('height', yScale.rangeBand());

  },

  didInsertElement: function() {
    this._start();
    this._draw();
  }
});
DE.LineChartComponent = Em.Component.extend(DE.ChartMixin, {
  classNames: ['de-line-chart'],
  didInsertElement: function() {
    this._start();
    console.log( 'line-chart' );
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
