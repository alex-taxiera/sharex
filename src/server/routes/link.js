import polka from 'polka'

import * as controller from '../controllers/link'
import {
  middlewares as auth
} from '../modules/auth'
import { noUpdatePath } from '../middleware/noUpdatePath'

export const routes = polka()

routes.get('/:id?', controller.get)
routes.post('/', auth.isLoggedIn, controller.post)
routes.patch(
  '/:id',
  noUpdatePath,
  auth.resourcePermission('link'),
  controller.patch
)
routes.delete('/:id', auth.resourcePermission('link'), controller.del)
