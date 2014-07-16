var mongoose = require('mongoose');

var Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var ReportSchema = new Schema({
  createdAt:   { type: Date, default: Date.now },
  name:         { type: String },
  description:  { type: String },
  elements:   [ { type: ObjectId, ref: 'Element' } ]
}, { collection: 'reports' });

mongoose.model('Report', ReportSchema);
