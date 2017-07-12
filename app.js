const express = require('express')
const app = express()
const path = require("path")
const dotenv = require('dotenv').config({ path: './.env' }).parsed
let opened = false
const GpioHelper = require('./server/gpio/Helper.js')
const availablePins = [ 16 ]

app.use(express.static('public'))

// Default routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

// io routes (gpio)
app.get('/io/toggle/:pinId', function (req, res) {
  const pin = parseInt(req.params.pinId)

  if (availablePins.indexOf(pin) === -1) {
    let msg = 'Pin ' + pin + ' is not available!'
    console.log(msg)
    res.send({ error: msg })
    return
  }

  GpioHelper.toggle(pin)
  let msg = 'Pin ' + pin + ' should be toggled'
  console.log(msg)
  res.send({ message: msg })
})

app.get('/io/state/:pinId', function (req, res) {
  const pin = parseInt(req.params.pinId)

  if (availablePins.indexOf(pin) === -1) {
    let msg = 'Pin ' + pin + ' is not available!'
    console.log(msg)
    res.send({ error: msg })
    return
  }

  GpioHelper.getState(pin, function(err, value) {
    res.send({ pin: pin, state: value })
  })
})

// tradsfri routes
app.get('/tradfri/:route/:query', function (req, res) {
  const route = req.params.route
  const query = req.params.query ? req.params.query : null

  console.log('got route: ', route)
  console.log('got query: ', query)
  console.log('______')
})

// start server
app.listen(dotenv.PORT, function () {
  console.log('Server listening on port ' + dotenv.PORT + '!')
})
