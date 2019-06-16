import Hashids from 'hashids'

import * as logger from '../utils/logger'
import { ServerResponse } from '../utils/respond'

const hash = new Hashids()

export async function reqLogger (req, res, next) {
  if (req.method === 'POST') {
    try {
      req.id = await req.db._knex('request').insert({
        ip: req.ip,
        user: req.user,
        url: req.url
      })
      req.hash = hash.encode(10000 + req.id)
    } catch (error) {
      logger.error('error with db:', error)
      return new ServerResponse(error, 500).send(res)
    }
  }
  next()
}
