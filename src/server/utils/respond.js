import send from '@polka/send-type'

const DEFAULT_MESSAGE = 'OK'
const DEFAULT_ERROR = 'ERROR'

export class ServerResponse {
  constructor (message, code = 200) {
    if (message instanceof Object) {
      if (code >= 300 || code < 200) {
        message.message = message.message || DEFAULT_ERROR
      }
      message = { message: message.message || DEFAULT_MESSAGE, ...message }
    }
    this.message = message
    this.code = code
  }

  send (res) {
    return send(res, this.code, this.message)
  }
}
