Ember.Handlebars.registerBoundHelper('date', function(date, specifier) {
  if (arguments.length === 2) specifier = '%Y-%m-%d';

  return Object.prototype.toString.call(date) === '[object Date]' ? d3.time.format(specifier)(date) : specifier;
});
