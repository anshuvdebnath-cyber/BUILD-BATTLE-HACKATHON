import { Router } from 'express';
import { adaptionController } from '../controllers/adaptionController.js';

const router = Router();

router.post('/clean', adaptionController.cleanData);
router.post('/train', adaptionController.trainModel);
router.get('/training-status', adaptionController.getTrainingStatus);
router.post('/predict', adaptionController.predict);

export default router;
