import { ServerResponse } from '../utils/respond'

export function masterPassword (req, res, next) {
  if (req.headers.password !== process.env.MASTER_PASSWORD) {
    new ServerResponse({ message: 'Master password required!' }, 403).send(res)
  } else {
    next()
  }
}
