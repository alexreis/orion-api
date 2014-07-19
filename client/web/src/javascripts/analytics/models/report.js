Oa.Report = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  elements: DS.hasMany('element', { async: true })
});
