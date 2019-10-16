import polka from 'polka'

import * as controller from '../controllers/paste'
import { noUpdatePath } from '../middleware/noUpdatePath'
import {
  middlewares as auth
} from '../modules/auth'

export const routes = polka()

routes.get('/:id?', controller.get)
routes.post('/', auth.isLoggedIn, controller.post)
routes.patch(
  '/:id',
  noUpdatePath,
  auth.resourcePermission('paste'),
  controller.patch
)
routes.delete('/:id', auth.resourcePermission('paste'), controller.del)
