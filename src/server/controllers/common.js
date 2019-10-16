import {
  send,
  OkResponse,
  ErrorResponse,
  CreatedResponse,
  NoContentResponse
} from '../modules/response'

export async function getResource (req, res, type) {
  try {
    send(res, new OkResponse({
      data: await req.db.getResource(req, type)
    }))
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function deleteFile (req, res, type) {
  const {
    id
  } = req.params

  try {
    await req.db.deleteFile(type, id)
    return send(res, new NoContentResponse())
  } catch (error) {
    send(res, new ErrorResponse(error))
  }
}

export async function postFileResponse (req, res, file) {
  send(res, new CreatedResponse(`${file.type}/${file.id}`, {
    [file.type]: {
      id: file.id,
      url: `${req.protocol || 'http://'}${req.headers.host}/${file.name}`
    }
  }))
}
