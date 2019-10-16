import {
  send,
  ErrorResponse,
  BadRequestResponse
} from '../modules/response'
import { getResource, postFileResponse, deleteFile } from './common'

const TYPE = 'link'

function linkTemplate (link) {
  return `<meta http-equiv="refresh" content="0; url=${link}" />`
}

export async function post (req, res) {
  const {
    link
  } = req.json

  if (!link) {
    return send(res, new BadRequestResponse('No Link Provided'))
  }

  if (
    !/([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/
      .test(link.toLowerCase())
  ) {
    return send(res, new BadRequestResponse('Invalid Link Provided'))
  }

  const name = req.hash
  const path = `${name}.html`

  try {
    const id = await req.db.postFile(
      req.id,
      TYPE,
      { name, path, url: link, user: req.user },
      linkTemplate(link)
    )
    postFileResponse(req, res, { id, name, type: TYPE })
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export function del (req, res) {
  req.start = Date.now()
  deleteFile(req, res, TYPE)
}

export function get (req, res) {
  getResource(req, res, TYPE)
}
