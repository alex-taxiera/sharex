import { promises as fs } from 'fs'
import { join } from 'path'

import {
  send,
  ErrorResponse,
  NoContentResponse,
  BadRequestResponse
} from '../modules/response'
import { getResource, postFileResponse, deleteFile } from './common'

import * as config from '../../config'

const TYPE = 'paste'

function pasteTemplate (title, text) {
  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta name="theme-color" content="maroon">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${text.match(/.{1,297}/g)[0]}...">
        <link rel="stylesheet" href="atom-one-dark.css">
        <link rel="stylesheet" href="paste.css">
        <script src="highlight.pack.js"></script>
        <script src="highlightjs-line-numbers.min.js"></script>
      </head>
      <body>
        <pre>
          <code id="code">${text}</code>
        </pre>
        <script>hljs.initHighlightingOnLoad();</script>
        <script>hljs.initLineNumbersOnLoad();</script>
      </body>
    </html>
  `
}

export async function post (req, res) {
  const {
    paste
  } = req.json

  if (!paste) {
    return send(res, new BadRequestResponse('No Paste Provided'))
  }

  const name = req.hash
  const path = `${name}.html`
  const preview = paste.length > 100 ? `${paste.substring(0, 96)}...` : paste

  try {
    const id = await req.db.postFile(
      req.id,
      TYPE,
      { name, preview, path, user: req.user },
      pasteTemplate('untitled', paste)
    )

    postFileResponse(req, res, { id, name, type: TYPE })
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function patch (req, res) {
  const {
    id
  } = req.params
  let {
    text,
    ...rest
  } = req.json

  try {
    await req.db.patch(TYPE, { id }, rest)

    if (text || rest.title) {
      const updatedPaste = await req.db.get({
        table: TYPE,
        where: { id }
      })

      const path = join(config.UPLOADS_DIR, updatedPaste.name)

      await fs.writeFile(
        path,
        pasteTemplate(
          updatedPaste.title,
          text || /<code id="code">(.*?)<\/code>/s.exec((await fs.readFile(path)).toString())[1]
        )
      )
    }

    send(res, new NoContentResponse())
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export function del (req, res) {
  deleteFile(req, res, TYPE)
}

export function get (req, res) {
  getResource(req, res, TYPE)
}
