import { fetchFile } from '../utils/fetchFile'
import { INITIAL_STATE } from '../../client/redux'

export async function fetchInitialReduxState (req, res, next) {
  const [
    links,
    images,
    pastes
  ] = await Promise.all([
    fetchFile(req, 'link', [ 'name', 'site' ]),
    fetchFile(req, 'image', [ 'name' ]),
    fetchFile(req, 'paste', [ 'name', 'title' ])
  ])

  req.initialState = {
    links: { ...INITIAL_STATE, data: links.files },
    images: { ...INITIAL_STATE, data: images.files },
    pastes: { ...INITIAL_STATE, data: pastes.files }
  }

  next()
}
