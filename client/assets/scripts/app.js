const axios = require('axios')

global.togglePin = function(pinId) {
  axios.get('/io/' + pinId).then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  });
}

setTimeout(function() {
  axios.get('/io/state/' + pinId).then(function (response) {
    console.log(response.data.pin + 'has state: ' + response.data.state)
  })
  .catch(function (error) {
    console.log(error)
  });
}, 500)
