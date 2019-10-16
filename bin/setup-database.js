const QueryBuilder = require('simple-knex')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const database = require('./database.json')

const {
  DB_CLIENT,
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASS
} = process.env

const logger = (...content) => console.log('setup-database:', ...content)

logger('creating tables in database:', DB_NAME)

const qb = new QueryBuilder({
  client: DB_CLIENT,
  connectionInfo: {
    database: DB_NAME,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS
  }
})

database.reduce((prom, table) => prom.then(() => {
  return qb._knex.schema.createTable(table.name, (t) => {
    for (const column of table.columns) {
      let col = t[column.type](column.name, ...(column.params || []))
      for (const key of Object.keys(column.options || {})) {
        const val = column.options[key]
        const params = Array.isArray(val) ? val : [ val ]
        col = col[key](...params)
      }
    }
  })
}), Promise.resolve(null))
