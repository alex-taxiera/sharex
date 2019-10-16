import { INITIAL_STATE } from '../../client/redux'

export async function fetchInitialReduxState (req) {
  const limit = 10

  const [
    links,
    images,
    pastes
  ] = await Promise.all([
    req.db.getResource(req, 'link', { limit }),
    req.db.getResource(req, 'image', { limit }),
    req.db.getResource(req, 'paste', { limit })
  ])

  return {
    links: { ...INITIAL_STATE, data: links },
    images: { ...INITIAL_STATE, data: images },
    pastes: { ...INITIAL_STATE, data: pastes }
  }
}
