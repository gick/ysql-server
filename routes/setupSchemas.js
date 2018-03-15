module.exports = function (app) {

    var Question = require('../models/question.js')
    var schemas = require('../config/questionSchemaRange.js')
    var YsqlSchema = require('../models/ysqlSchema.js')

    /**
     * We associate the correct schema code to each questions
     * 
     */

    app.get('/setQuestionsSchemas', function (req, res) {
        Question.find()
            .exec(function (err, results) {
                if (err) {
                    return res.send(err)
                }
                for (var i = 0; i < results.length; i++) {
                    var currentQuestion = results[i]
                    var currentSchema = schemas.schemaByNumber(parseInt(currentQuestion.number)).name
                    currentQuestion.ysqlSchema = currentSchema
                    currentQuestion.save(function (err, result) {
                        if (err) {
                            return res.send(err)
                        }
                    })
                }
                res.send('done')
            })
    })


    /**
     * We generate the YSQL schemas description (name,number of question,total maximum, question range)
     * from the question documents that were imported and associated to YSQL schema
     * This allows an easy check of the correctness for questions documents schema value   
     */
    app.get('/fillShemasModel', function (req, res) {
        Question.distinct('ysqlSchema')
            .exec((err, results) => {
                if (err) {
                    next(err);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        var schema = new YsqlSchema()
                        schema.code = results[i]
                        schema.questionRange = schemas.schemaByCode(schema.code).pages
                        schema.questionNumber = schemas.schemaByCode(schema.code).pages.length
                        schema.totalMaximum = schemas.schemaByCode(schema.code).pages.length * 6
                        schema.save((err, result) => {
                            if(err){
                              return  res.send(err)
                            } 
                        })
                    }
                    res.send('done');
                }

            })
        /*         Question.aggregate([{$group : {_id:'$ysqlSchema',questionPerSchema:{$sum :1}}}],(err,results)=>{
                    if (err) {
                        next(err);
                    } else {
                        res.json(results);
                    }
            
                })
         */

    })


}