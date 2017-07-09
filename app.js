const express = require('express')
const app = express()
const path = require("path")
const gpio = require("pi-gpio")
const dotenv = require('dotenv').config({ path: './.env' }).parsed
let opened = false

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

app.get('/io/:pinId', function (req, res) {
  const pin = parseInt(req.params.pinId)

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

    res.send('Pin ' + pin + ' should be toggled')
    } else {
      res.send('PinId not defined!')
    }
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
