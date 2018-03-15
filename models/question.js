var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = mongoose.Schema({
    number:String,
    question: String,
    ysqlSchema:String,
})

module.exports = mongoose.model('Question', questionSchema);