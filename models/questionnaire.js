var mongoose = require('mongoose');

var Schema   = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var QuestionnaireSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  name:           { type: String },
  variables:    [ { type: ObjectId, ref: 'Variable' } ]
}, { collection: 'questionnaires' });

mongoose.model('Questionnaire', QuestionnaireSchema);
