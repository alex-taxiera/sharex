const { promises: {
  readdir,
  unlink
} } = require('fs')

const logger = (...content) => console.log('clean:', ...content)

logger('cleaning dist...')

readdir('dist')
  .then((fileNames) =>
    Promise.all(fileNames.map(async (fileName) => {
      if (fileName.endsWith('.js') || fileName.endsWith('.css')) {
        return unlink(`dist/${fileName}`)
      }
    }))
  )
