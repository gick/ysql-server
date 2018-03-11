var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = mongoose.Schema({
    number:Number,
    response: Number,
    dateTime:Date,
    ysqlSchema:String,
    user:String,
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
})

module.exports = mongoose.model('Response', responseSchema);