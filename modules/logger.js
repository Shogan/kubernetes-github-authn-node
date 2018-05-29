var winston = require('winston')
require('winston-daily-rotate-file')

var consoleTransport = new winston.transports.Console({
  timestamp: true,
  colorize: true
})

var dailyRotateTransport = new (winston.transports.DailyRotateFile)({
  filename: './logs/node-kubernetes-github-authn.log',
  datePattern: 'yyyy-MM-dd.',
  localTime: false,
  prepend: true,
  maxDays: 180,
  level: 'info'
})

var logger = new (winston.Logger)({
  transports: [
    consoleTransport,
    dailyRotateTransport
  ]
})

module.exports = logger