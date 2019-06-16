import bcrypt from 'bcrypt'

import { ServerResponse } from '../utils/respond'

export function setup (options = {}) {
  const { blacklist = [] } = options
  return async (req, res, next) => {
    if (blacklist.includes(req.ip)) {
      req.isBlacklisted = true
    } else if (req.headers.username) {
      const user = await req.db.get({
        table: 'user',
        where: {
          username: req.headers.username
        }
      })
      if (user && bcrypt.compareSync(req.headers.password, user.password)) {
        req.isAuthorized = true
        req.user = user.id
      }
    }
    next()
  }
}

export function enforce (req, res, next) {
  if (req.isBlacklisted || !req.isAuthorized) {
    new ServerResponse(req.isBlacklisted ? 'Blacklisted!' : 'Unauthorized', 403)
      .send(res)
  } else {
    next()
  }
}
