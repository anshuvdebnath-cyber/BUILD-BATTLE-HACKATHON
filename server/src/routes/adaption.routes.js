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

// POST /api/adaption/solutions/generate
// Generates deep engineering solutions with optional free LLM (Groq Llama-3.3-70B / Mixtral)
router.post("/solutions/generate", async (req, res) => {
  try {
    const { issues = [] } = req.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (groqApiKey && issues.length > 0) {
      try {
        const prompt = `You are an elite Principal Software Architect and Customer Experience Strategist.
Analyze the following top customer friction issues and output a JSON array of actionable solutions.
Issues:
${JSON.stringify(issues, null, 2)}

Return strictly a valid JSON array of objects with keys:
- topic: string
- severity: "Critical" | "High" | "Medium"
- targetSla: string (e.g. "24h Hotfix", "48h Sprint", "3-Day Sprint")
- rootCause: string (1-2 sentences on technical root cause)
- engineeringFix: string (2-3 sentences on concrete architectural/code fix)
- productCountermeasure: string (1-2 sentences on customer retention / UX fallback)
- estArrAtRisk: number`;

        const groqModel = "openai/gpt-oss-20b";
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [{ role: "user", content: prompt + "\nStrictly output valid raw JSON with a 'solutions' array." }],
            temperature: 0.3
          })
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const raw = data.choices[0].message.content;
          // Extract JSON block if surrounded by markdown fences
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          const content = JSON.parse(cleaned);
          const solutions = Array.isArray(content) ? content : (content.solutions || Object.values(content)[0]);
          return res.json({ success: true, provider: "groq-ai", solutions });
        } else {
          const errText = await groqRes.text();
          console.warn("Groq API returned error status:", groqRes.status, errText);
        }
      } catch (err) {
        console.warn("Groq live inference failed, using built-in model:", err.message);
      }
    }

    res.json({
      success: true,
      provider: "adaption-autoscientist-mistral-7b",
      hasGroqKey: !!groqApiKey
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
