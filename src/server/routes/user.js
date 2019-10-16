import polka from 'polka'

import * as controller from '../controllers/user'
import {
  middlewares as auth
} from '../modules/auth'

export const routes = polka()

routes.get('/:id?', controller.get)
routes.post('/', controller.post)
routes.patch('/:id', auth.isResource('user'), controller.patch)
routes.delete('/:id', auth.isResource('user'), controller.del)

routes.post('/sign-in', controller.signIn.post)
