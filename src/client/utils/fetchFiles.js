import queryString from 'query-string'

import { fetchJSON } from './fetchJSON'

export const fetchFiles = (loading, success, error, type, options = {}) => {
  console.log('fetchFiles')
  return (dispatch) => {
    console.log('dispatch')
    const query = queryString.stringify(options)

    dispatch(loading())
    fetchJSON(`/api/${type}${query ? '?' + query : ''}`)
      .then(({ files }) => dispatch(success(files, options)))
      .catch((err) => dispatch(error(err)))
  }
}
