const QueryBuilder = require('simple-knex')

export function database (dbInfo) {
  const db = new QueryBuilder(dbInfo)
  return async (req, res, next) => {
    req.db = db
    next()
  }
}
