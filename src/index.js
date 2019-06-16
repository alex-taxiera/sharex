require('@babel/register')()
require('ignore-styles').default([ '.css', '.sass', '.scss' ])
require('./server')
