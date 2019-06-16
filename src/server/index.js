import { join } from 'path'
import polka from 'polka'
import staticserve from 'serve-static'

import * as logger from './utils/logger'
import * as auth from './middleware/auth'
import { fetchInitialReduxState } from './middleware/fetchInitialReduxState'
import { parseJSON } from './middleware/parseJSON'
import { masterPassword } from './middleware/masterPassword'
import { database } from './middleware/database'
import { ip } from './middleware/ip'
import { reqLogger } from './middleware/reqLogger'

import { generateHTML } from './utils/generateHTML'

import * as user from './routes/user'
import * as image from './routes/image'
import * as link from './routes/link'
import * as paste from './routes/paste'

import * as config from '../config'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_CLIENT,
  AUTH_TOKEN
} = process.env

const {
  PORT,
  UPLOADS_DIR,
  EXTENSIONS
} = config

const app = polka()

app
  .use(staticserve(join(__dirname, '../../dist')))
  .use(staticserve(join(__dirname, '../assets')))
  .use(staticserve(UPLOADS_DIR, { extensions: EXTENSIONS }))
// MIDDLEWARES
app
  .use(parseJSON)
  .use(database({
    client: DB_CLIENT,
    connectionInfo: {
      host: DB_HOST,
      user: DB_USER,
      database: DB_NAME
    }
  }))
  .use(ip)
  .use(auth.setup(AUTH_TOKEN))
  .use(reqLogger)

app.put('/api/user/:key', masterPassword, user.put)
app.post('/api/user', masterPassword, user.post)

app.get('/api/link', link.get)
app.post('/api/link', auth.enforce, link.post)

app.get('/api/paste', paste.get)
app.put('/api/paste/:key', masterPassword, paste.put)
app.post('/api/paste', auth.enforce, paste.post)

app.get('/api/image', image.get)
app.post('/api/image', auth.enforce, image.post)

app.get('*', fetchInitialReduxState, async (req, res) => {
  res.end(generateHTML(req))
})

app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  logger.success(`started on port ${PORT}`)
})
