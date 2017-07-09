const axios = require('axios')

global.togglePin = function(pinId) {
  axios.get('/io/' + pinId).then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  });
}

setInterval(function() {
  const pinId = 16
  axios.get('/io/state/' + pinId).then(function (response) {
    console.log(response.data.pin + 'has state: ' + response.data.state)
    if (response.data.state) {
      document.getElementById('btn-16').classList.add('active')
    } else {
      document.getElementById('btn-16').classList.remove('active')
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}, 500)
