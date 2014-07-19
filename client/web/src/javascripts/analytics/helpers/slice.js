Ember.Handlebars.registerBoundHelper('slice', function(string, characters) {
  var slicedString = string.slice(0, characters);

  if (slicedString !== string) {
    return slicedString + '...'
  } else {
    return string;
  }
});
