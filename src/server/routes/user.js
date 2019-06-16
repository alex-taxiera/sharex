import bcrypt from 'bcrypt'

import { ServerResponse } from '../utils/respond'

async function hash (text) {
  return bcrypt.hash(text, 12)
}

export async function post (req, res) {
  const {
    username,
    password,
    ...rest
  } = req.json

  let response

  if (!username) {
    response = new ServerResponse(Error('Missing username!'), 400)
  } else if (!password) {
    response = new ServerResponse(Error('Missing password!'), 400)
  }
  if (response) {
    return response.send(res)
  }

  try {
    const [ id ] = await req.db._knex('user')
      .insert({
        username,
        password: await hash(password),
        ...rest
      })
    response = new ServerResponse({ id })
  } catch (error) {
    response = new ServerResponse(error, 500)
  }

  response.send(res)
}

export async function put (req, res) {
  const key = req.params.key
  const {
    password,
    ...rest
  } = req.json

  let response

  try {
    if (password) {
      rest.password = await hash(password)
    }

    await req.db._knex('user')
      .where(
        req.query.type === 'username'
          ? { username: key }
          : { id: key }
      )
      .update(rest)

    response = new ServerResponse()
  } catch (error) {
    response = new ServerResponse(error, 500)
  }

  response.send(res)
}
