import { createActions } from 'reduxsauce'

const { Creators, Types } = createActions({
  requestLinks: [],
  successLinks: [ 'files', 'tail' ],
  errorLinks: [ 'error' ],
  requestPastes: [],
  successPastes: [ 'files', 'tail' ],
  errorPastes: [ 'error' ],
  requestImages: [],
  successImages: [ 'files', 'tail' ],
  errorImages: [ 'error' ],
  updatePaste: [],
  successUpdatePaste: [ 'paste' ]
})

export { Creators, Types }
