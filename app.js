const express = require('express')
const app = express()
const path = require('path')
const rootDir = path.resolve(__dirname)
const fs = require('fs')
const dotenv = require('dotenv').config({ path: './.env' }).parsed
let opened = false
const GpioHelper = require('./server/gpio/Helper.js')
const availablePins = [ 16 ]
const exec = require('child_process').exec;

// load dotenv config
const dotenvPath = path.resolve(rootDir, '.env')
if (fs.existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath })
}

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
  console.log(req.params)
  const route = decodeURIComponent(req.params.route)
  const query = req.params.query ? decodeURIComponent(req.params.query) : null

  console.log(route)
  console.log(query)
  console.log(process.env.TRADFRI_IP)
  console.log(process.env.TRADFRI_TOKEN)
  console.log(process.env.TRADFRI_PORT)

  let command = ''

  if (!query) {
    command = 'coap-client -m get -u "Client_identity" -k "'
      + process.env.TRADFRI_TOKEN + '" "coaps://' + process.env.TRADFRI_IP + ":"
      + process.env.TRADFRI_PORT + '/' + route + '"'
  } else {
    command = 'coap-client -m put -u "Client_identity" -k "'
      + process.env.TRADFRI_TOKEN + '" -e \'' + query + '\''
      + '" "coaps://' + process.env.TRADFRI_IP + ":"
      + process.env.TRADFRI_PORT + '/' + route + '"'
  }

  console.log('Execute command', command)
  exec(command, { timeout: 5000 }, (err, stdOut) => {
    console.log('command was executed')
    if (stdOut) {
      try {
        console.log(stdOut)
        JSON.parse(stdOut.split('\n')[3])
      } catch (errResponse) {
        reject(`Invalid response: ${errResponse}`)
      }
    } else {
      reject('Failed to connect!')
    }
  })


  return
})

// start server
app.listen(dotenv.PORT, function () {
  console.log('Server listening on port ' + dotenv.PORT + '!')
})
