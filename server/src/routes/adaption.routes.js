import express from 'express';
import multer from 'multer';
import {
  uploadDataset,
  runRecipes,
  checkStatus,
  downloadCleanedData,
  uploadLabeledData,
  startTraining,
  checkTrainingStatus,
} from '../services/adaptionService.js';
import { adaptionController } from '../../controllers/adaptionController.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ==========================================
// CORE ADAPTION LABS ENDPOINTS
// ==========================================

// POST /api/adaption/upload
// Upload CSV file and automatically start cleaning recipes
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    console.log(`\n📂 Processing: ${req.file.originalname}`);
    const result = await uploadDataset(req.file.path);
    
    if (result.success) {
      // Auto-start recipes
      const recipeResult = await runRecipes(result.datasetId);
      res.json({
        ...result,
        runId: recipeResult.runId || `mock_run_${Date.now()}`,
        status: "processing",
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/adaption/status/:runId
// Check cleaning job status
router.get("/status/:runId", async (req, res) => {
  try {
    const result = await checkStatus(req.params.runId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /api/adaption/download/:runId
// Download cleaned data
router.get("/download/:runId", async (req, res) => {
  try {
    const result = await downloadCleanedData(req.params.runId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/adaption/training/start
// Upload labeled data and start model training
router.post("/training/start", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    console.log(`\n📂 Training data: ${req.file.originalname}`);
    
    const uploadResult = await uploadLabeledData(req.file.path);
    if (!uploadResult.success) {
      return res.status(500).json(uploadResult);
    }

    const trainingResult = await startTraining(uploadResult.datasetId);
    res.json({
      ...trainingResult,
      message: "Training started (10-15 minutes)",
    });
  } catch (error) {
    console.error("Training route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/adaption/training/status/:trainingId
// Check training progress
router.get("/training/status/:trainingId", async (req, res) => {
  try {
    const result = await checkTrainingStatus(req.params.trainingId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ==========================================
// COMPATIBILITY ENDPOINTS (Studio & Views)
// ==========================================
router.post('/clean', adaptionController.cleanData);
router.post('/train', adaptionController.trainModel);
router.get('/training-status', adaptionController.getTrainingStatus);
router.post('/predict', adaptionController.predict);

export default router;
