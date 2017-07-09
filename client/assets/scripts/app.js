const axios = require('axios')

global.togglePin = function(pinId) {
  axios.get('/io/' + pinId).then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  });
}
