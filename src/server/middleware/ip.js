import * as logger from '../modules/logger'

export function ip (req, res, next) {
  req.ip = req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress
  logger.info('request from:', req.ip)
  next()
}
