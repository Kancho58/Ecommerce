import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as validate from '../middlwares/validate';
import { loginSchema, updateSchema, userSchema } from '../validators/user';
import authenticate from '../middlwares/authenticate';

const router = Router();

router
  .route('/register')
  .post(validate.schema(userSchema), userControllers.register);

router
  .route('/login')
  .post(validate.schema(loginSchema), userControllers.login);

router.use(authenticate);

router.route('/my').get(userControllers.fetchUserDetails);

router
  .route('/update')
  .post(validate.schema(updateSchema), userControllers.update);

export default router;
