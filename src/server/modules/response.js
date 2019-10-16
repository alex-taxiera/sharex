import sendType from '@polka/send'

import * as logger from './logger'

const DEFAULT_MESSAGE = 'Ok'
const DEFAULT_ERROR = 'Error'

const CODES = {
  OK_RANGE: { LO: 200, HI: 299 },
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ERROR: 500
}

export class Response {
  constructor (message, code = CODES.OK, headers = {}) {
    if (message instanceof Object) {
      if (code > CODES.OK_RANGE.HI || code < CODES.OK_RANGE.LO) {
        message.message = message.message || DEFAULT_ERROR
      }
      message = { message: message.message || DEFAULT_MESSAGE, ...message }
    } else if (message) {
      message = { message }
    }
    this.message = message
    this.code = code
    this.headers = headers
  }
}

export class OkResponse extends Response {
  constructor (message, headers) {
    super(message, CODES.OK, headers)
  }
}

export class CreatedResponse extends Response {
  constructor (location, message = 'Created', headers = {}) {
    super(message, CODES.CREATED, {
      Location: location,
      ...headers
    })
  }
}

export class NoContentResponse extends Response {
  constructor (headers) {
    super('', CODES.NO_CONTENT, headers)
  }
}

export class BadRequestResponse extends Response {
  constructor (message, headers) {
    super(message, CODES.BAD_REQUEST, headers)
  }
}

export class ForbiddenResponse extends Response {
  constructor (message = 'Forbidden', headers) {
    super(message, CODES.FORBIDDEN, headers)
  }
}

export class NotFoundResponse extends Response {
  constructor (message = 'Not Found', headers) {
    super(message, CODES.NOT_FOUND, headers)
  }
}

export class ErrorResponse extends Response {
  constructor (error, headers) {
    logger.error('Responding with error :', error)
    super(error, CODES.ERROR, headers)
  }
}

export function send (res, response) {
  return sendType(res, response.code, response.message, response.headers)
}
