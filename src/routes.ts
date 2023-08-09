import { Router } from 'express';
import userRoutes from './routes/users';
import authenticate from './middlwares/authenticate';
import productsRoutes from './routes/products';
const router: Router = Router();

router.use('/users', userRoutes);

router.use(authenticate);

router.use('/products', productsRoutes);

export default router;
