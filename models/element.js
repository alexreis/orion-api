var mongoose = require('mongoose');

var Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var ElementSchema = new Schema({
  title:          { type: String },
  createdAt:      { type: Date, default: Date.now },
  elementType:    { type: String },
  position:       { type: Number },
  report:         { type: ObjectId, ref: 'Report' },
  data:         [  ]
}, { collection: 'elements' });

mongoose.model('Element', ElementSchema);
