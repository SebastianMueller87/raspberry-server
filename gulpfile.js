const path = require('path')
const elixir = require('laravel-elixir')
require('laravel-elixir-pug')

const clientSrcPath = './client'
const clientDestPath = './public'

elixir(mix => {
  mix.sass(
    clientSrcPath + '/assets/styles/main.scss',
    clientDestPath + '/css'
  )

  // scripts
  mix.browserify(
    clientSrcPath + '/assets/scripts/app.js',
    clientDestPath + '/js'
  )

  mix.pug({
      blade: false,
      pretty: true,
      src: clientSrcPath + '/views/',
      search: '**/*.pug',
      pugExtension: '.pug',
      dest: clientDestPath + '/views'
  })
})
