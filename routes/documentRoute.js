module.exports = function (app) {
    var mongoose = require('mongoose')
    var Multimap = require('multimap')
    var Question = require('../models/question.js')
    var Response = require('../models/response.js')
    var User = require('../models/user.js')
    var schemas = require('../config/questionSchemaRange.js')

    /** Modify an user password.
     *  Only available to admin
     * @param password in the body request
     */
    app.post('/changepass', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send()
        }
        if (req.user && req.user.isAdmin) {
            User.findOne({
                    _id: req.body.userId
                })
                .exec(function (err, user) {
                    if (err) {
                        return res.send(err)
                    }
                    if (user) {
                        user.password = user.generateHash(req.body.password);
                        user.save((err, result) => {
                            res.send({
                                success: true,
                                ressource: result
                            })
                        })
                    }
                })
        }
    })

    app.post('/adduser', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send()
        }
        let user = new User()
        user.name = req.body.name
        user.password = user.generateHash(req.body.password);
        user.save((err, result) => {
            res.send({
                success: true,
                ressource: result
            })
        })
    })

    /**
     * Delete an unique user and all her data in the mongo backend
     * Only available to admin
     * @param userId
     */
    app.delete('/user/:id', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.status(401).send()
        }
        if (req.user && req.user.isAdmin) {
            User.findOneAndRemove({
                _id: req.params.id
            }, (err, result) => {
                if (err) {
                    return res.send(err)
                }
                return res.send({
                    success: true,
                    resource: result
                })
            })
        }

    })

    app.get('/responses/:userId', function (req, res) {
        Response.find({
                user: req.params.userId
            })
            .populate('question')
            .exec(function (err, results) {
                let resultArray = aggregateSchemas(results)
                res.send(resultArray)
            })
        return
    })

    app.get('/responsesCompleted/:userId', function (req, res) {
        Response.find({
                user: req.params.userId
            })
            .exec(function (err, results) {
                res.send({completed:results.length})
            })
        return
    })


    /**
     * Aggregate the user responses by schemas (ED,AB...)
     * For each schemas, compute the score based on responses
     * 
     * @param {array} results 
     * @returns An array of JSON containing responses aggregated by schema and their scores
     */
    aggregateSchemas = function (results) {
        var m = new Multimap()
        for (var i = 0; i < results.length; i++) {
            m.set(results[i].ysqlSchema, {
                question: results[i].question.question,
                response: results[i].response
            })
        }
        var resultArray = []
        for (let entry of m.keys()) {
            resultArray.push({
                schema: entry,
                questions: m.get(entry)
            })
        }
        /**
         * Compute, for each schemas, the number of responses  
         * 4, 5 and 6. Used to calculate schemas scores
         *  
         */
        for (let i = 0; i < resultArray.length; i++) {
            var currentSchema = resultArray[i]
            var fourResponses = 0
            var fiveResponses = 0
            var sixResponses = 0

            for (let j = 0; j < currentSchema.questions.length; j++) {
                switch (currentSchema.questions[j].response) {
                    case 4:
                        fourResponses = fourResponses + 1
                        break;
                    case 5:
                        fiveResponses = fiveResponses + 1
                        break;
                    case 6:
                        sixResponses = sixResponses + 1
                        break;
                }
                currentSchema.detailedScore = {
                    four: fourResponses,
                    five: fiveResponses,
                    six: sixResponses
                }

                currentSchema.score=fourResponses*4+fiveResponses*5+sixResponses*6

            }
        }

        return resultArray
    }

    app.get('/question/:number', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.send({
                response: null,
                message: 'Please authenticate'
            })

        }
        Response.findOne({
                number: req.params.number,
                user: req.user._id
            })
            .exec(function (err, response) {
                if (response && response.number) {
                    res.send(response)
                } else {
                    res.send({
                        response: null
                    })
                }

            })
    })

    app.get('/users', function (req, res) {
        User.find()
            .exec(function (err, results) {
                res.send(results)
            })
        return
    })
    app.get('/question', function (req, res) {
        Question.find()
            .exec(function (err, results) {
                res.send(results)

            })
        return
    })

    app.post('/question/:number', function (req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                response: null,
                message: 'Please authenticate'
            })
        }

        Response.findOne({
                number: req.params.number,
                user: req.user._id
            })
            .exec(function (err, response) {
                if (response && response.number) {
                    response.response = parseInt(req.body.response)
                    response.question = req.body.questionId
                    response.save()
                    res.send(response)
                } else {
                    let response = new Response()
                    response.question = req.body.questionId
                    response.ysqlSchema = schemas.schemaByNumber(parseInt(req.params.number)).name
                    response.user = req.user._id
                    response.number = parseInt(req.params.number)
                    response.response = parseInt(req.body.response)
                    response.dateTime = new Date()
                    response.save()
                    res.send(response)
                }

            })
    })

}