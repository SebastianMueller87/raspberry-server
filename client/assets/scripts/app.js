const axios = require('axios')
const pinId = 16
let state = 0

global.togglePin = function(pinId) {
  axios.get('/io/toggle/' + pinId).then(function (response) {
    console.log(response)
    if (!response.data.error) {
      toggleButton()
      state = !state
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}

setInterval(function() {
  axios.get('/io/state/' + pinId).then(function (response) {
    console.log(response.data.pin + 'has state: ' + response.data.state)
    if (state !== response.data.state) {
      console.log('Current state' + state)
      console.log('New state' + response.data.state)
      state = response.data.state
      toggleButton()
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}, 500)

function toggleButton() {
  const element = document.getElementById('btn-16')

  if (element.classList.contains('btn-danger')) {
    element.classList.remove('btn-danger')
    element.classList.add('btn-success')
    element.innerHTML = 'ON'
  } else if (element.classList.contains('btn-success')) {
    element.classList.remove('btn-success')
    element.classList.add('btn-danger')
    element.innerHTML = 'OFF'
  } else {
    console.log('Button does not have any expected class.')
  }
}
