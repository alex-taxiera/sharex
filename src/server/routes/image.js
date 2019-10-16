import polka from 'polka'

import {
  middlewares as auth
} from '../modules/auth'
import * as controller from '../controllers/image'
import { noUpdatePath } from '../middleware/noUpdatePath'

export const routes = polka()

routes.get('/:id?', controller.get)
routes.post('/', auth.isLoggedIn, controller.post)
routes.patch(
  '/:id',
  noUpdatePath,
  auth.resourcePermission('image'),
  controller.patch
)
routes.delete('/:id', auth.resourcePermission('image'), controller.del)
