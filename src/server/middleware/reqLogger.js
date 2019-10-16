import Hashids from 'hashids'

import * as logger from '../modules/logger'
import {
  send,
  ErrorResponse
} from '../modules/response'

const hash = new Hashids()

export async function reqLogger (req, res, next) {
  if (req.method === 'POST') {
    try {
      const [ id ] = await req.db.post('request', {
        ip: req.ip,
        user: req.user,
        url: req.url
      })

      req.id = id
      req.hash = hash.encode(10000 + req.id)
      next()
    } catch (error) {
      logger.error('error with db:', error)
      send(res, new ErrorResponse(error))
    }
  } else {
    next()
  }
}
