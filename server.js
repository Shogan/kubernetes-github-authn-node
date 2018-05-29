"use strict";

const express = require("express")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const github = require('octonode')
const logger = require('./modules/logger')
const port = 3000

let app = express();

// Setup various middlewares
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg : msg,
      value: value
    }
  }
}))

// Setup application routes
app.get('/', (req, res) => {
  logger.info('ping')
  res.sendStatus(200)
})

app.post('/authenticate', (req, res) => {
  let postData = req.body
  if (postData === null || postData === 'undefined') {
    let responseJson = {
      'apiVersion': 'authentication.k8s.io/v1beta1',
      'kind': 'TokenReview',
      'status': {
        'Authenticated': false
      }
    }
    res.status(401).send(responseJson)
  } else {
    
    let token = postData.spec.token
    let client = github.client(token)
    client.get('/user', {}, function (err, status, body, headers) {
      if (err) {
        logger.error('could not retrieve user with the token passed in.', err)
        let responseJson = {
          'apiVersion': 'authentication.k8s.io/v1beta1',
          'kind': 'TokenReview',
          'status': {
            'Authenticated': false
          }
        }
        res.status(401).send(responseJson)
      } else {
        logger.info('authenticated OK with github for user: ' + body.login)
        let responseJson = {
          'apiVersion': 'authentication.k8s.io/v1beta1',
          'kind': 'TokenReview',
          'status': {
            'Authenticated': true,
            'User': {
              'Username': body.login,
              'UID': body.login
              // Potentially in the future get user team membership from github, and pass into Groups[] here...
            }
          }
        }
        res.status(200).send(responseJson)
      }
    })
  }
})

app.listen(port);
logger.info('Application started and listening on port ' + port)