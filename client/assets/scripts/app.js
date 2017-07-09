const axios = require('axios')
const pinId = 16

global.togglePin = function(pinId) {
  axios.get('/io/toggle/' + pinId).then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  });
}

setInterval(function() {
  axios.get('/io/state/' + pinId).then(function (response) {
    console.log(response.data.pin + 'has state: ' + response.data.state)
    const elementClassList = document.getElementById('btn-16')

    if (response.data.state) {
      element.classList.remove('btn-danger')
      element.classList.add('btn-success')
      element.innerHTML = 'ON'
    } else {
      element.classList.remove('btn-success')
      element.classList.add('btn-danger')
      element.innerHTML = 'OFF'
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}, 500)
