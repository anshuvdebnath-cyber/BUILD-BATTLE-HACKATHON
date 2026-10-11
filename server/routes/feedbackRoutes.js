import { Router } from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', feedbackController.getFeedbacks);
router.post('/', feedbackController.createFeedback);
router.post('/upload', upload.single('file'), feedbackController.uploadCSV);

export default router;
