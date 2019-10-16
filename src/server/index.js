import { join } from 'path'
import polka from 'polka'
import staticserve from 'serve-static'

import * as logger from './modules/logger'
import { parseJSON } from './middleware/parseJSON'
import { middleware as database } from './modules/database'
import { ip } from './middleware/ip'
import { reqLogger } from './middleware/reqLogger'

import { fetchInitialReduxState } from './utils/fetchInitialReduxState'
import { generateHTML } from './utils/generateHTML'

import { api } from './routes'

import * as config from '../config'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv')
    .config()
}

const {
  SHAREX_DB_HOST,
  SHAREX_DB_NAME,
  SHAREX_DB_USER,
  SHAREX_DB_PASS,
  SHAREX_DB_CLIENT
} = process.env

const {
  PORT,
  UPLOADS_DIR,
  EXTENSIONS
} = config

const app = polka({
  onNoMatch: async (req, res) =>
    res.end(generateHTML(req, await fetchInitialReduxState(req)))
})

app
  .use(staticserve(join(__dirname, '../../dist')))
  .use(staticserve(join(__dirname, '../assets')))
  .use(staticserve(UPLOADS_DIR, { extensions: EXTENSIONS }))
// MIDDLEWARES
app
  .use(parseJSON)
  .use(database({
    client: SHAREX_DB_CLIENT,
    connection: {
      host: SHAREX_DB_HOST,
      user: SHAREX_DB_USER,
      database: SHAREX_DB_NAME,
      password: SHAREX_DB_PASS
    }
  }))
  .use(ip)
  .use(reqLogger)

app.use('/api', api)

app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  logger.success(`started on port ${PORT}`)
})
