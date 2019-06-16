import queryString from 'query-string'

import { fetchJSON } from '../utils/fetchJSON'
import { Creators } from './actions'

const {
  requestLinks,
  successLinks,
  errorLinks,
  requestPastes,
  successPastes,
  errorPastes,
  requestImages,
  successImages,
  errorImages,
  updatePaste,
  successUpdatePaste
} = Creators

export const fetchLinks = (id, { tail = true } = {}) => {
  return (dispatch) => {
    const query = queryString.stringify({
      id,
      tail
    })

    dispatch(requestLinks())
    fetchJSON(`/api/link?${query}`)
      .then(({ files }) => dispatch(successLinks(files, tail)))
      .catch((error) => dispatch(errorLinks(error)))
  }
}

export const fetchPastes = (id, { tail = true } = {}) => {
  return (dispatch) => {
    const query = queryString.stringify({
      id,
      tail
    })

    dispatch(requestPastes())
    fetchJSON(`/api/paste?${query}`)
      .then(({ files }) => dispatch(successPastes(files, tail)))
      .catch((error) => dispatch(errorPastes(error)))
  }
}

export const putPaste = (key, { password, ...data }) => {
  return (dispatch) => {
    dispatch(updatePaste())
    fetchJSON(`/api/paste/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data }),
      password
    })
      .then(({ paste }) => dispatch(successUpdatePaste(paste)))
      .catch((error) => dispatch(errorPastes(error)))
  }
}

export const fetchImages = (id, { tail = true } = {}) => {
  return (dispatch) => {
    const query = queryString.stringify({
      id,
      tail
    })

    dispatch(requestImages())
    fetchJSON(`/api/image?${query}`)
      .then(({ files }) => dispatch(successImages(files, tail)))
      .catch((error) => dispatch(errorImages(error)))
  }
}
