import { promises as fs } from 'fs'
import { join } from 'path'

import { UPLOADS_DIR } from '../../config'

export async function saveFile (req, type, oldPath, data) {
  await fs.rename(oldPath, join(UPLOADS_DIR, data.name))
  await Promise.all([
    req.db._knex(type).insert({ ...data, user: req.user }),
    req.db._knex('request').where({ id: req.id }).update({ file: data.name })
  ])
}
