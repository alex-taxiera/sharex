import { promises as fs } from 'fs'

import { parseFormData } from '../utils/parseFormData'
import {
  send,
  ErrorResponse,
  BadRequestResponse
} from '../modules/response'

import { EXTENSIONS } from '../../config'
import { splitFileName } from '../utils/splitFileName'
import { getResource, postFileResponse, deleteFile } from './common'

const TYPE = 'image'

export async function post (req, res) {
  try {
    const { files: { image } } = await parseFormData(req)
    const [ , ext ] = splitFileName(image.name)

    if (!EXTENSIONS.includes(ext) || ext === 'html') {
      send(res, new BadRequestResponse('Not An Image'))
    } else {
      const name = req.hash
      const path = `${name}.${ext}`
      const id = await req.db.postFile(
        req.id,
        TYPE,
        { name, path, user: req.user },
        await fs.readFile(image.path)
      )

      postFileResponse(req, res, { id, name, type: TYPE })
    }
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function patch (req, res) {
  const id = req.params.id

  try {
    const {
      fields,
      files
    } = await parseFormData(req)

    if (files.image) {
      const {
        path
      } = await req.db.get({
        table: 'image',
        columns: [ 'path' ],
        where: { id }
      })
      await fs.writeFile(path, await fs.readFile(files.image.path))
    }
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export function del (req, res) {
  deleteFile(req, res, TYPE)
}

export function get (req, res) {
  getResource(req, res, 'image')
}
