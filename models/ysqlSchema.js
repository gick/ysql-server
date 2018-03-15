var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ysqlSchema = mongoose.Schema({
    code:{type:String, required: true, unique: true },
    questionNumber: Number,
    totalMaximum:Number,
    questionRange:Array,
    })

module.exports = mongoose.model('YsqlSchema', ysqlSchema);