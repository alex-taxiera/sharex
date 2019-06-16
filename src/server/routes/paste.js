import { promises as fs } from 'fs'
import { join } from 'path'

import { ServerResponse } from '../utils/respond'
import { fetchFile } from '../utils/fetchFile'
import { parseFilesFromForm } from '../utils/parseFilesFromForm'
import { saveFile } from '../utils/saveFile'
import { pasteTemplate } from '../utils/pasteTemplate'

import * as config from '../../config'

export async function post (req, res) {
  let response
  try {
    const files = await parseFilesFromForm(req)
    const fileName = req.hash
    const filePath = fileName + '.html'
    const text = (await fs.readFile(files.fdata.path)).toString()
    await fs.writeFile(filePath, pasteTemplate('untitled', text))
    await saveFile(req, 'paste', filePath, { name: filePath })
    response = new ServerResponse(`${req.headers.host}/${fileName}`)
  } catch (error) {
    response = new ServerResponse(error, 500)
  }
  response.send(res)
}

export async function put (req, res) {
  const key = req.params.key
  let {
    text,
    ...rest
  } = req.json

  let response
  try {
    await req.db._knex('paste')
      .where(
        req.query.type === 'name'
          ? { name: key }
          : { id: key }
      )
      .update(rest)

    const updatedPaste = await req.db.get({
      table: 'paste',
      where: req.query.type === 'name'
        ? { name: key }
        : { id: key }
    })

    const path = join(config.UPLOADS_DIR, updatedPaste.name)

    await fs.writeFile(
      path,
      pasteTemplate(
        updatedPaste.title,
        text || /<code id="code">(.*?)<\/code>/s.exec((await fs.readFile(path)).toString())[1]
      )
    )

    response = new ServerResponse({ paste: updatedPaste })
  } catch (error) {
    response = new ServerResponse(error, 500)
  }
  response.send(res)
}

export async function get (req, res) {
  let response
  try {
    response = new ServerResponse(await fetchFile(req, 'paste', [ 'name', 'title' ]))
  } catch (error) {
    response = new ServerResponse(error, 500)
  }
  response.send(res)
}
