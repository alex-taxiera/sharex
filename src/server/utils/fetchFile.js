export async function fetchFile (req, table, columns = '*') {
  const {
    id,
    tail = true
  } = req.query

  const query = req.db._knex(table)
    .orderBy('id', 'desc')
    .select([ 'id', ...columns ])
    .limit(10)

  if (id) {
    query.where('id', (tail === 'true' ? '<' : '>'), id)
  }

  return {
    files: await query
  }
}
