let gpio = null
let openedPins = []

try {
  gpio = require("pi-gpio")
} catch (e) {
  console.log('Cannot require pi-gpio')
  console.log(e)
}

let self = module.exports = {
  isOpen: function(pin) {
    return openedPins.indexOf(pin) !== -1
  },

  open: function(pin, direction, callback) {
    if (!self.isOpen(pin)) {
      gpio.open(pin, direction, function(err) {
        openedPins.push(pin)
        callback()
      })
    } else {
      callback()
    }
  },

  close: function(pin) {
    if (self.isOpen(pin)) {
      gpio.close(pin)
    }
  },

  toggle: function(pin, callback) {
    self.open(pin, "input", function() {
      gpio.read(pin, function(err, value) {
        console.log('GPIO: ' + pin + ' is currently ' + value)
        gpio.setDirection(pin, 'output', function(err) {
          console.log('GPIO: ' + pin + ' changed to output')
          const newValue = value === 0 ? 1 : 0
          gpio.write(pin, newValue, function(err) {
              console.log('GPIO: ' + pin + ' wrote ' + newValue)
              // gpio.close(pin)
          })
        })
      })
    })
  },

  getState: function(pin, callback) {
    self.open(pin, "input", function() {
      gpio.read(pin, function(err, value) {
        callback(err, value)
      })
    })
  }
}

