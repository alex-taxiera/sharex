import { IncomingForm } from 'formidable'

import * as logger from '../modules/logger'

export function parseFormData (req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        logger.error('error parsing form data:', err)
        reject(err)
      } else {
        resolve({
          fields,
          files
        })
      }
    })
  })
}
