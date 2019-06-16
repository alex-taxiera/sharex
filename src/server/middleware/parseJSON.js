export async function parseJSON (req, res, next) {
  if (req.headers['content-type'] === 'application/json') {
    req.json = await readJSON(req)
  }
  next()
}

async function readJSON (req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () =>
      resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}'))
    )
  })
}
