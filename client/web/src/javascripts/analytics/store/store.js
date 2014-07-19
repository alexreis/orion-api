// window.HOST = 'http://192.34.56.106';
window.HOST = 'http://localhost:3080';

Oa.ApplicationAdapter = DS.RESTAdapter.extend();

Oa.ApplicationAdapter.reopen({
  pathForType: function(type) {
    var underscored = Ember.String.underscore(type)
    return Ember.String.pluralize(underscored);
  },

  namespace: 'v1',
  host: 'http://localhost:3080',
  // host: 'http://192.34.56.106',
  // host: 'http://api.orion.voxdobrasil.com:3080',

  headers: {
    'X-Auth-Token': localStorage.token
  }
});

DS.JSONSerializer.reopen({
  primaryKey: '_id'
});

Oa.RawTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

Oa.ArrayTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

Oa.IsodateTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    var format = d3.time.format.iso;
    return format.parse(serialized);
  },
  serialize: function(deserialized) {
    var format = d3.time.format.iso;
    return format.parse(deserialized);
  }
});
