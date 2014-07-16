var mongoose = require('mongoose');

var Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var VariableSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  name:           { type: String },
  type:           { type: String },
  questionnaire:  { type: ObjectId, ref: 'Questionnaire' },
  values:       [  ]
}, { collection: 'variables' });

mongoose.model('Variable', VariableSchema);
