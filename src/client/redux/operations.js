import { fetchFiles } from '../utils/fetchFiles'
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

export const fetchLinks = (options = {}) =>
  fetchFiles(requestLinks, successLinks, errorLinks, 'link', options)

export const fetchPastes = (options = {}) =>
  fetchFiles(requestPastes, successPastes, errorPastes, 'paste', options)

export const putPaste = (id, { password, ...data }) => {
  return (dispatch) => {
    dispatch(updatePaste())
    fetchJSON(`/api/paste/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data }),
      password
    })
      .then(({ paste }) => dispatch(successUpdatePaste(paste)))
      .catch((error) => dispatch(errorPastes(error)))
  }
}

export const fetchImages = (options = {}) =>
  fetchFiles(requestImages, successImages, errorImages, 'image', options)
