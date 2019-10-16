import { promises as fs } from 'fs'
import { join } from 'path'

import knex from 'knex'

import { UPLOADS_DIR } from '../../config'

export class DatabaseManager {
  constructor (dbInfo) {
    this._knex = knex(dbInfo)
  }

  _transact () {
    return new Promise((resolve, reject) => {
      this._knex.transaction((t) => resolve(t))
    })
  }

  post (resourceType, data) {
    return this._knex(resourceType)
      .insert(data)
  }

  delete (resourceType, where) {
    return this._knex(resourceType)
      .where(where)
      .del()
  }

  patch (resourceType, where, data) {
    return this._knex(resourceType)
      .where(where)
      .update(data)
  }

  async put (resourceType, data, id) {
    if (id) {
      const old = await this.get(resourceType, { id })
      const empty = Object.keys(old)
        .reduce((ax, dx) => {
          ax[dx] = null
          return ax
        }, {})
      return this.patch(resourceType, { id }, { ...data, ...empty })
    }
    return this.post(resourceType, data)
  }

  get (resourceType, where, options = {}) {
    const {
      limit
    } = options

    const query = this._knex(resourceType)
      .where(where)

    if (limit) {
      query.limit(limit)
    }

    return query
      .select()
  }

  async postFile (reqId, resourceType, data, file) {
    await fs.writeFile(join(UPLOADS_DIR, data.path), file)
    const transaction = await this._transact()
    try {
      const [ fileId ] = await this._knex(resourceType)
        .transacting(transaction)
        .insert(data)
      await this._knex(`request-${resourceType}`)
        .transacting(transaction)
        .insert({
          request: reqId,
          [resourceType]: fileId
        })

      transaction.commit()
      return fileId
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  async deleteFile (resourceType, id) {
    const transaction = await this._transact()
    try {
      await this._knex(`request-${resourceType}`)
        .transacting(transaction)
        .where({ [resourceType]: id })
        .del()
      await this._knex(resourceType)
        .transacting(transaction)
        .where({ id })
        .del()
      return transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  getResource (req, resourceType, options = {}) {
    const {
      id
    } = req.params || {}
    const {
      head,
      tail,
      ascending
    } = req.query
    const {
      columns = [ '*' ],
      limit = 100
    } = options

    const query = this._knex(resourceType)

    if (id) {
      query.where({ id })
    } else {
      query.orderBy('id', ascending ? 'asc' : 'desc')
        .limit(limit)

      if (head || tail) {
        query.where('id', (tail ? '<' : '>'), tail || head)
      }
    }

    return query.select(columns)
  }
}

export function middleware (dbInfo) {
  const db = new DatabaseManager(dbInfo)
  return (req, res, next) => {
    req.db = db
    next()
  }
}
