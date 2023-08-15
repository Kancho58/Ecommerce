import { Router } from 'express';
import * as productControllers from '../controllers/products';
import * as validate from '../middlwares/validate';
import { productSchema } from '../validators/product';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authorizeByAdmin } from '../middlwares/authenticate';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    if (!fs.existsSync('public/files')) {
      fs.mkdirSync('public/files');
    }

    cb(null, 'public/files');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });
const router = Router();

router.route('/').get(productControllers.fetch);

router.use(authorizeByAdmin);
router.route('/admin').get(productControllers.fetchByAdmin);

router
  .route('/create')
  .post(
    upload.single('image'),
    validate.schema(productSchema),
    productControllers.save
  );
router
  .route('/:id/update')
  .post(upload.single('image'), productControllers.update);

export default router;
