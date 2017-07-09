const path = require('path')
const elixir = require('laravel-elixir')

elixir(mix => {
  // scripts
  mix.browserify(
    './app/js/main.js',
    './public/js'
  )
})
