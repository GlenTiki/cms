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
var Recaptcha = require('recaptcha').Recaptcha

var Q = require('q')

var tools = require('./nodejs/tools')

var rp = require('request-promise') // https://www.npmjs.com/package/request-promise

var morgan = require('morgan')             // log requests to the console (express4)
var bodyParser = require('body-parser')    // pull information from HTML POST (express4)

var connectionListener = false

//var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(morgan('dev'))                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}))            // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })) // parse application/vnd.api+json as json
 //   app.use(methodOverride());



if ( process &&
     process.env &&
				process.env.VCAP_APP_HOST &&
					process.env.cloud_controller_url.indexOf('bluemix.net') > -1 )
					{
				//	process.env.VCAP_APP_HOST was 0.0.0.0 in bluemix not a searchable string
			         // a remote installation
								  port = (process.env.VCAP_APP_PORT || 3000)
								  host = (process.env.VCAP_APP_HOST || 'localhost')
								  app.use(
										'/', //the URL throught which you want to access to you static content
										express.static(__dirname + '/public')
								)
								  console.log('remote')
					}
else {
					  // a local installation

						  port = 3000
						  host = 'localhost'

						  app.use(
								'/', //the URL throught which you want to access to you static content
							       //where your static content is located in your filesystem
							express.static(__dirname + '/public')
						)
						  console.log('localhost:3000')
					    console.log(__dirname)
						  console.log(new Date())

				}


app.listen(port, host)


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.put("/api/1/signup", function (req, res) {

	  console.log('put /api/1/signup')
	  console.log(req.body)
	  res.send(req.body)
})

app.get('/table', function (req, res) {
  getPosts(function (err, posts) {
    if (err) return res.json(err)
    res.render('table.html', {posts: posts})
  })
})

app.get('/api/1/requests', function (req, res) {
  console.log('here')
  getRequests(function (err, posts) {
    if (err) return res.json(err)
    res.json( {posts: posts})
  })
})


		//////////////////
