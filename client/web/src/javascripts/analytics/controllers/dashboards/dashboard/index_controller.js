Oa.DashboardsDashboardIndexController = Em.ObjectController.extend({
  from: null,
  toFAKE: null,
  to: function() {
    var toFAKE = this.get('toFAKE');

    var format = d3.time.format('%Y-%m-%d');

    toFAKE = format.parse(toFAKE);

    var to = d3.time.day.offset(toFAKE, 2);

    return format(to);

  }.property('toFAKE')
});
