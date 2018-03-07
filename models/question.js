var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = mongoose.Schema({
    number:String,
    question: String,
})

module.exports = mongoose.model('Question', questionSchema);