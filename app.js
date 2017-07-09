const express = require('express')
const app = express()
const path = require("path")
const dotenv = require('dotenv').config({ path: './.env' }).parsed
let opened = false
const gpio = null
const availablePins = [ 16 ]

try {
  gpio = require("pi-gpio")
} catch (e) {
  console.log('Cannot require pi-gpio')
  console.log(e)
}

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

app.get('/io/toggle/:pinId', function (req, res) {
  const pin = parseInt(req.params.pinId)

  if (gpio === null || availablePins.indexOf(pin) === -1) {
    let msg = 'Pin ' + pin + ' is not available!'
    console.log(msg)
    res.send({ error: msg })
    return
  }

  if (pin === 16) {
    if (!opened) {
      gpio.open(pin, "input", function(err) {
        console.log('GPIO: ' + pin + ' opened')
        opened = true
        toggle(pin)
      })
    } else {
      toggle(pin)
    }

    let msg = 'Pin ' + pin + ' should be toggled'
    console.log(msg)
    res.send({ message: msg })
    } else {
      let msg = 'PinId not defined'
      console.log(msg)
      res.send({ error: msg })
    }
})

app.get('/io/state/:pinId', function (req, res) {
  const pin = parseInt(req.params.pinId)

  if (gpio === null || availablePins.indexOf(pin) === -1) {
    let msg = 'Pin ' + pin + ' is not available!'
    console.log(msg)
    res.send({ error: msg })
    return
  }

  gpio.open(pin, "input", function(err) {
    console.log('GPIO: ' + pin + ' opened')
    getState(pin, function(err, value) {
      res.send({ pin: pin, state: value })
    })
  })
})

app.listen(dotenv.PORT, function () {
  console.log('Server listening on port ' + dotenv.PORT + '!')
})

function toggle(pin) {
  gpio.read(pin, function(err, value) {
    console.log('GPIO: ' + pin + ' is currently ' + value)
    gpio.setDirection(pin, 'output', function(err) {
      console.log('GPIO: ' + pin + ' changed to output')
      const newValue = value === 0 ? 1 : 0
      gpio.write(pin, newValue, function() {
          console.log('GPIO: ' + pin + ' wrote ' + newValue)
          // gpio.close(pin)
      })
    })
  })
}

function getState(pin, callback) {
  gpio.read(pin, function(err, value) {
    callback(err, value)
  })
}
