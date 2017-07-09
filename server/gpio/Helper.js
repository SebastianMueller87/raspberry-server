let gpio = null

try {
  gpio = require("pi-gpio")
} catch (e) {
  console.log('Cannot require pi-gpio')
  console.log(e)
}

module.exports = {
  toggle: function(pin) {
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
  },

  getState: function(pin, callback) {
    gpio.open(pin, "input", function(err) {
      console.log('GPIO: ' + pin + ' opened')
      gpio.read(pin, function(err, value) {
        callback(err, value)
      })
    })
  }
}


