if (process.env.NODE_ENV !== 'production') {
  require('dotenv')
    .config()
}

const {
  NODE_ENV,
  SHAREX_DB_HOST,
  SHAREX_DB_NAME,
  SHAREX_DB_USER,
  SHAREX_DB_PASS,
  SHAREX_DB_CLIENT
} = process.env

module.exports = {
  [NODE_ENV]: {
    client: SHAREX_DB_CLIENT,
    connection: {
      host: SHAREX_DB_HOST,
      database: SHAREX_DB_NAME,
      user: SHAREX_DB_USER,
      password: SHAREX_DB_PASS
    }
  }
}
