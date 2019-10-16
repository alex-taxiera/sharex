import polka from 'polka'

import * as user from './user'
import * as image from './image'
import * as link from './link'
import * as paste from './paste'

export const api = polka()

api.get('/', (req, res) => {
  res.end('yolo')
})

api.use('/user', user.routes)
api.use('/image', image.routes)
api.use('/link', link.routes)
api.use('/paste', paste.routes)
