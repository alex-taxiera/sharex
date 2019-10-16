import {
  send,
  ForbiddenResponse
} from '../modules/response'

export function noUpdatePath (req, res, next) {
  if (
    Object.keys(req.json)
      .some((key) => key === 'path')
  ) {
    send(res, new ForbiddenResponse('Cannot update file path'))
  } else {
    next()
  }
}
