module.exports = function (app) {
    var mongoose = require('mongoose')
    var Question = require('../models/question.js')
    var Response = require('../models/response.js')
    app.get('/question/:number', function (req, res) {
        if (!req.isAuthenticated()) {
			return res.send({
				response: null,
				message: 'Please authenticate'
            })
            
        }   
          
        Response.findOne({
                number: req.params.number,
                user:req.user._id
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
                user:req.user._id
            })
            .exec(function (err, response) {
                if (response && response.number) {
                    response.response = req.body.response
                    response.save()
                    res.send(response)
                } else {
                    let response = new Response()
                    response.user=req.user._id
                    response.number = req.params.number
                    response.response = req.body.response
                    response.dateTime = new Date()
                    response.save()
                    res.send(response)
                }

            })
    })

}