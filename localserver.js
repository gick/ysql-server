var express  = require('express')
var app      = express()
var port     = process.env.PORT || 8000
var mongoose = require('mongoose')
var passport = require('passport')
var cookieParser = require('cookie-parser')
var session      = require('express-session')
var bodyParser   = require('body-parser')
var json2xls = require('json2xls');
var configDB = require('./config/localdatabase.js')
var webdir = require('./config/localconfig.js')
var busboyBodyParser = require('busboy-body-parser')
var bodyPar = require('busboy-body-parser')

// configuration ===============================================================
mongoose.connect(configDB[0].url) // connect to our database
require('./config/passport.js')(passport) // pass passport for configuration

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))
app.use(busboyBodyParser())
app.use(json2xls.middleware);

/* 
app.use(session({ secret: 'ilovefreudandlacan' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
 */

// routes ======================================================================
require('./routes/routes.js')(app,webdir,passport) // load our routes and pass in our app and fully configured passport
require('./routes/documentRoute.js')(app,json2xls)
require('./routes/setupSchemas.js')(app)
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port)
