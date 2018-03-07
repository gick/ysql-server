var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = mongoose.Schema({
    number:String,
    response: String,
    dateTime:Date,
    user:String,
})

module.exports = mongoose.model('Response', responseSchema);