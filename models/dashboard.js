var mongoose = require('mongoose');

var Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var DashboardSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  name:           { type: String },
  description:    { type: String },
  variables:    [  ]
}, { collection: 'dashboards' });

mongoose.model('Dashboard', DashboardSchema);
