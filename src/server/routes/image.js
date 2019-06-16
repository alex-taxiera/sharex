import { ServerResponse } from '../utils/respond'
import { fetchFile } from '../utils/fetchFile'
import { parseFilesFromForm } from '../utils/parseFilesFromForm'
import { saveFile } from '../utils/saveFile'

import { EXTENSIONS } from '../../config'

export async function post (req, res) {
  try {
    const files = await parseFilesFromForm(req)
    const {
      fdata: {
        name,
        path
      }
    } = files

    const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    if (!EXTENSIONS.includes(ext) || ext === 'html') {
      throw Error('Not an image')
    }
    const fileName = req.hash
    await saveFile(req, 'image', path, { name: `${fileName}.${ext}` })
    new ServerResponse(`${req.headers.host}/${fileName}`).send(res)
  } catch (error) {
    new ServerResponse(error, 500).send(res)
  }
}

export async function get (req, res) {
  new ServerResponse(await fetchFile(req, 'image', [ 'name' ])).send(res)
}
