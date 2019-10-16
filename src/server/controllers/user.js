import bcrypt from 'bcrypt'

import {
  utils as auth
} from '../modules/auth'
import {
  send,
  BadRequestResponse,
  CreatedResponse,
  ErrorResponse,
  NoContentResponse,
  OkResponse
} from '../modules/response'
import { getResource } from './common'

const TYPE = 'user'

async function hash (text) {
  return bcrypt.hash(text, 12)
}

export function get (req, res) {
  getResource(req, res, TYPE)
}

export async function del (req, res) {
  const {
    id
  } = req.params

  try {
    await this.req.db.delete(TYPE, { id })
    send(res, new NoContentResponse())
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function post (req, res) {
  const {
    username,
    password,
    ...rest
  } = req.json

  if (!username) {
    return send(res, new BadRequestResponse('Missing Username'))
  } else if (!password) {
    return send(res, new BadRequestResponse('Missing Password'))
  }

  try {
    const [ id ] = await req.db.post('user', {
      username,
      password: await hash(password),
      ...rest
    })
    send(res, new CreatedResponse(`${TYPE}/${id}`, { id }))
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function patch (req, res) {
  const {
    username,
    password,
    ...rest
  } = req.json

  try {
    if (password) {
      rest.password = await hash(password)
    }

    if (username && req.db.sele) {

    }

    await req.db.patchResource(req, TYPE, rest)

    send(res, new NoContentResponse())
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

async function signInPost (req, res) {
  try {
    const token = await auth.signIn(req)
    send(res, new OkResponse({ token }))
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export const signIn = {
  post: signInPost
}
