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
