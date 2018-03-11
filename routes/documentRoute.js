module.exports = function (app) {
    var mongoose = require('mongoose')
    var Question = require('../models/question.js')
    var Response = require('../models/response.js')
    var User = require('../models/user.js')
    var schemas=require('../config/questionSchemaRange.js')
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
                            res.send({success:true,ressource:result})
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
            res.send({success:true,ressource:result})
        })
    })


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
                return res.send({success:true,resource:result})
            })
        }

    })

    app.get('/responses/:userId', function (req, res) {
        Response.find({
                user: req.params.userId
            })
            .populate('question')
            .exec(function (err, results) {
                res.send(results)
            })
        return
    })

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
                    response.ysqlSchema=schemas(parseInt(req.params.number)).name
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