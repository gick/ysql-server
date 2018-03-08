var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = mongoose.Schema({
    number:String,
    response: String,
    dateTime:Date,
    user:String,
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
})

module.exports = mongoose.model('Response', responseSchema);