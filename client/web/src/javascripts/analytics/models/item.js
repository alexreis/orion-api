Oa.Item = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  type: DS.attr('string'),
  questionnaire: DS.belongsTo('questionnaire')
});
