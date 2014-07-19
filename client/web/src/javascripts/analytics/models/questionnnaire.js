Oa.Questionnaire = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  variables: DS.attr('array'),
  items: DS.hasMany('item', { async: true })
});
