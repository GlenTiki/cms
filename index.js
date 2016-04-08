// securing api?

// http://stackoverflow.com/questions/15496915/how-to-implement-a-secure-rest-api-with-node-js
// https://developers.google.com/identity/protocols/OpenIDConnect?hl=en

// http://thejackalofjavascript.com/architecting-a-restful-node-js-app/
// http://thejackalofjavascript.com/architecting-a-restful-node-js-app/


var host_uri = "localhost" //

// for local testing



var express = require('express')
var app = express()

var _ = require('lodash')
var path = require('path')
var https = require('https')
var data = require('./data')

var morgan = require('morgan')             // log requests to the console (express4)
var bodyParser = require('body-parser')    // pull information from HTML POST (express4)

var connectionListener = false

//	process.env.VCAP_APP_HOST was 0.0.0.0 in bluemix not a searchable string
// a remote installation
var port = (process.env.VCAP_APP_PORT || 3000)
var host = (process.env.VCAP_APP_HOST || 'localhost')

//var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(morgan('dev'))                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}))            // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })) // parse application/vnd.api+json as json
 //   app.use(methodOverride());

// serving static files, which is cool for a SPA
app.use('/', express.static(__dirname + '/public'))

//serve up rlaceys cms. we can put it in an iframe for testing purpoises!
app.use('/cms', express.static(__dirname + '/cms/public'))

app.get('/data', function (req, res) {
  res.send(data)
})

app.post('/data', function (req, res) {
  // If I had more time and less college work, I would do data validation over here.
  console.log(req)
  data = req.body.data
  res.send(data)
})

var server = {},
    listener //used for closing listener
server.create = function (cb) {
	listener = app.listen(port, host)
	cb(host, port)
}

server.stop = function (cb) {
  console.log(listener)
  listener.close(cb)
}

module.exports = server

if (!module.parent) {
    server.create(function(host, port){console.log('listening on ', host, port)})
}
