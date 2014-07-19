Oa.Dashboard = DS.Model.extend({
  createdAt: DS.attr('isodate'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  variables: DS.attr('array')
});
