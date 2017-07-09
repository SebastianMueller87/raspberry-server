var express = require('express');
var app = express();
var path = require("path");
var dotenv = require('dotenv').config({ path: './.env' }).parsed

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(dotenv.PORT, function () {
  console.log('Server listening on port ' + dotenv.PORT + '!');
});
