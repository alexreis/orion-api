Oa.ReportsReportIndexController = Em.ObjectController.extend({
  elements: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['position'],
      content: this.get('content.elements')
    });
  }).property('content.elements'),

  currentElementPosition: function() {
    return this.get('currentElementIndex') + 1;
  }.property('currentElementIndex'),

  currentElementIndex: 0,

  isLastElement: false,

  actions: {
    previousElement: function() {
      console.log('previousElement' );
      var position = this.get('currentElementIndex');

      if (position > 0) {
        this.decrementProperty('currentElementIndex');
      }
    },

    nextElement: function() {
      console.log('nextElement' );

      var n = this.get('elements').get('length');
      var currentElementIndex = this.get('currentElementIndex');

      if (currentElementIndex + 1 < n) {
        this.incrementProperty('currentElementIndex');
        this.set('isLastElement', false);
      } else {
        this.set('isLastElement', true);
      }
      
      this.send('renderElement');
    }
  }
});
