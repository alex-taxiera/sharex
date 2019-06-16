export async function fetchJSON (request, options = {}) {
  if (options.method === 'PUT' || options.method === 'POST') {
    options.headers = {
      'content-type': 'application/json',
      password: options.password
    }
  }

  const res = await fetch(request, options)
  const body = await res.json()

  if (!res.ok) {
    throw body
  } else {
    return body
  }
}
