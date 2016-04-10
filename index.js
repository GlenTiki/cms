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
var cradle = require('cradle')


var dbconf = {
  secure: false
}
if (process.env.VCAP_SERVICES) {
  var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
  dbconf = {
    host: VCAP_SERVICES.cloudantNoSQLDB[0].credentials.host,
    port: VCAP_SERVICES.cloudantNoSQLDB[0].credentials.port,
    username: VCAP_SERVICES.cloudantNoSQLDB[0].credentials.username,
    password: VCAP_SERVICES.cloudantNoSQLDB[0].credentials.password,
    secure: true
  }
}
dbconf = {
  host: dbconf.host || 'localhost',
  port: dbconf.port || 5984,
  auth: {
    username: dbconf.username || 'cms',
    password: dbconf.password || 'default'
  },
  secure: dbconf.secure
}

cradle.setup({
  host: dbconf.host,
  port: dbconf.port,
  cache: true,
  raw: false,
  secure: dbconf.secure,
  auth: dbconf.auth,
  retries: 3,
  retryTimeout: 30 * 1000
})
var dbConnection = new cradle.Connection()
var db = dbConnection.database('cms')

db.exists(function (err, exists) {
  if (err) {
    console.log('error creating mediasync db', err.message, err)
    console.log('exiting!')
    process.exit(1)
  } else if (exists) {
    db.get('data', function(err, doc) {
      if (err || !doc) {
        db.save('data', data)
      }
    })
  } else {
    console.log('mediasync database does not exist yet. creating.')
    db.create()

    setTimeout(function () {
      db.get('data', function(err, doc) {
        if (err || !doc) {
          db.save('data', data)
        }
      })
    }, 1000)
  }
})


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
  db.get('data', function(err, doc) {
    res.send(doc)
  })
})

app.post('/data', function (req, res) {
  // If I had more time and less college work, I would do data validation over here.
  var data = req.body.data
  db.save('data', data, function (err, doc) {
    res.send(data)
  })
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
