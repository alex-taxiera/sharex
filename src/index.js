require('@babel/register')({
  ignore: [ /\/node_modules\/(?!hashids)/ ]
})
require('ignore-styles')
  .default([ '.css', '.sass', '.scss' ])
require('./server')
