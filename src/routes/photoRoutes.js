import { Router } from 'express';
import loginRequired from '../middlewares/loginRequired';

import PhotoController from '../controllers/PhotoController';

const router = new Router();

const photoController = new PhotoController();

router.post('/', loginRequired, (req, res) => photoController.store(req, res));

export default router;
