import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import {
  send,
  ErrorResponse,
  ForbiddenResponse
} from '../modules/response'

async function isAdmin (req, userId) {
  const user = await req.db.get('user', { id: userId })

  return user.isAdmin
}

async function requireAdmin (req, res, next) {
  const userId = await identifyUser(req)

  if (isAdmin(req, userId)) {
    next()
  } else {
    send(new ForbiddenResponse('Admin Endpoint'))
  }
}

async function signIn (req) {
  const {
    username,
    password
  } = req.json

  const user = await req.db.get('user', { username })
  return new Promise((resolve, reject) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      jwt.sign({
        username: user.username,
        id: user.id
      }, process.env.SHAREX_JWT_SECRET,
      { expiresIn: '12h' },
      (error, encoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(encoded)
        }
      })
    } else {
      reject(Error('User not found'))
    }
  })
}

async function isLoggedIn (req, res, next) {
  try {
    const id = await identifyUser(req)

    if (!id) {
      throw Error('invalid signature')
    }
    req.user = id
    next()
  } catch (error) {
    handleError(res, error)
  }
}

function isResource (type) {
  return async (req, res, next) => {
    const {
      id: resourceId
    } = req.params

    try {
      const userId = await identifyUser(req)

      if (!userId) {
        throw Error('invalid signature')
      }

      if (isAdmin(req, userId)) {
        return next()
      }

      const resource = await req.db.get(type, { id: resourceId })

      if (resource.id === userId) {
        req.user = userId
        next()
      } else {
        throw Error('invalid signature')
      }
    } catch (error) {
      handleError(res, error)
    }
  }
}

function resourcePermission (type) {
  return async (req, res, next) => {
    const {
      id: resourceId
    } = req.params

    try {
      const userId = await identifyUser(req)
      if (!userId) {
        throw Error('invalid signature')
      }

      if (isAdmin(req, userId)) {
        return next()
      }

      const resource = await req.db.get(type, { id: resourceId })

      if (resource.user === userId) {
        req.user = userId
        next()
      } else {
        throw Error('invalid signature')
      }
    } catch (error) {
      handleError(res, error)
    }
  }
}

function handleError (res, error) {
  switch (error.message) {
    case 'invalid signature':
      send(res, new ForbiddenResponse('Unauthorized'))
      break
    case 'jwt malformed':
      send(res, new ForbiddenResponse('Invalid JWT'))
      break
    default:
      send(res, new ErrorResponse(error))
  }
}

async function identifyUser (req) {
  const key = req.headers['x-api-key']

  if (key) {
    const [ apiKey ] = await getApiKey(req, key)
    if (apiKey && apiKey.isValid) {
      return apiKey.user
    }
  } else {
    let token =
      req.headers['x-access-token'] ||
      req.headers['authorization']

    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.substring('Bearer '.length)
      }

      const { id } = await decode(token)

      if (id) {
        return id
      }
    }
  }
}

async function getApiKey (req, key) {
  return req.db.get('api-key', { key })
}

async function decode (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SHAREX_JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded)
      }
    })
  })
}

export const middlewares = {
  isLoggedIn,
  resourcePermission,
  isResource,
  requireAdmin
}

export const utils = {
  signIn
}
