const { promises: { mkdir } } = require('fs')

const logger = (...content) => console.log('postinstall:', ...content)

logger('adding dist and uploads folders...')

Promise.all([
  mkdir('dist'),
  mkdir('uploads')
])
  .then(() => logger('done!'))
