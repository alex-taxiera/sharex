import { createWriteStream } from 'fs'

import { ServerResponse } from '../utils/respond'
import { fetchFile } from '../utils/fetchFile'
import { saveFile } from '../utils/saveFile'

export function post (req, res) {
  const link = req.headers.link
  if (!link) {
    return new ServerResponse(Error('No link provided!'), 400).send(res)
  }

  if (
    !/([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/
      .test(link.toLowerCase())
  ) {
    return new ServerResponse(Error('Invalid link provided!'), 400).send(res)
  }

  const fileName = req.hash
  const stream = createWriteStream(`${fileName}.html`)
  stream.once('open', async (fd) => {
    stream.end(`<meta http-equiv="refresh" content="0; url=${link}" />`)
    let response
    try {
      await saveFile(req, 'link', `${fileName}.html`, { name: `${fileName}.html`, site: link })
      response = new ServerResponse(`http://${req.headers.host}/${fileName}`)
    } catch (error) {
      response = new ServerResponse(error, 500)
    }
    response.send(res)
  })
}

export async function get (req, res) {
  let response
  try {
    response = new ServerResponse(await fetchFile(req, 'link', [ 'name', 'site' ]))
  } catch (error) {
    response = new ServerResponse(error, 500)
  }
  response.send(res)
}
