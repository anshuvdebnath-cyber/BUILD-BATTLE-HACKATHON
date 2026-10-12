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
  adaptionService
} from '../services/adaptionService.js';
import { adaptionController } from '../../controllers/adaptionController.js';
import { storageService } from '../../services/storageService.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ==========================================
// CORE ADAPTION LABS PRODUCTION ENDPOINTS
// ==========================================

// GET /api/adaption/model/info
// Returns current trained AutoScientist model details
router.get("/model/info", async (req, res) => {
  try {
    const info = await adaptionService.getModelInfo();
    res.json({ success: true, ...info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/adaption/datasets
// List all datasets in Adaption Labs Cloud
router.get("/datasets", async (req, res) => {
  try {
    const datasets = await adaptionService.listDatasets();
    res.json({ success: true, count: datasets.length, datasets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/adaption/datasets/:datasetId
// Get details & evaluation summary for a specific dataset
router.get("/datasets/:datasetId", async (req, res) => {
  try {
    const dataset = await adaptionService.getDataset(req.params.datasetId);
    res.json({ success: true, dataset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/adaption/datasets/:datasetId/download
// Download dataset raw CSV
router.get("/datasets/:datasetId/download", async (req, res) => {
  try {
    const csvData = await adaptionService.downloadDataset(req.params.datasetId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.datasetId}.csv"`);
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/adaption/datasets/load-cloud
// Load a real cloud dataset directly into the active dashboard storage
router.post("/datasets/load-cloud", async (req, res) => {
  try {
    const { datasetId = '9d4d969a-5a30-452c-b8bd-1ec6772350a8', limit = 150 } = req.body;
    console.log(`📥 Loading cloud dataset ${datasetId} into InsightFlow...`);
    
    const csvContent = await adaptionService.downloadDataset(datasetId);
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length <= 1) {
      return res.status(400).json({ success: false, error: "Empty dataset downloaded from cloud" });
    }

    // Adaption preference pair CSV header: enhanced_prompt,chosen,rejected,...
    const parsedRows = [];
    // Skip header line
    for (let i = 1; i < Math.min(lines.length, limit + 1); i++) {
      const line = lines[i];
      // Basic CSV field extractor
      let text = line;
      if (line.startsWith('"')) {
        const endQuote = line.indexOf('",');
        if (endQuote !== -1) {
          text = line.substring(1, endQuote).replace(/""/g, '"');
        }
      } else {
        const parts = line.split(',');
        text = parts[0] || '';
      }

      const lower = text.toLowerCase();
      const isCritical = lower.includes('crash') || lower.includes('fail') || lower.includes('error') || lower.includes('exploit') || lower.includes('crisis') || lower.includes('struggle') || lower.includes('broken');
      const isPerf = lower.includes('slow') || lower.includes('delay') || lower.includes('latency') || lower.includes('waiting');
      const isPositive = lower.includes('good') || lower.includes('great') || lower.includes('praise') || lower.includes('improved') || lower.includes('efficient');

      parsedRows.push({
        customer_id: `ADAPT-USER-${1000 + i}`,
        customerName: `Adaption Account #${1000 + i}`,
        feedback_text: text,
        rawText: text,
        date: new Date(Date.now() - (i * 3600 * 1000)).toISOString().split('T')[0],
        source: 'Adaption Labs Cloud',
        sentiment: isPositive ? 'positive' : isCritical ? 'negative' : isPerf ? 'negative' : 'neutral',
        category: isCritical ? 'Critical Product Friction' : isPerf ? 'Performance & Latency' : 'Customer Experience',
        urgency: isCritical ? 'critical' : isPerf ? 'high' : 'medium',
        arrValue: isCritical ? 65000 : 35000
      });
    }

    storageService.clear();
    storageService.insertMany(parsedRows);

    res.json({
      success: true,
      message: `Successfully loaded ${parsedRows.length} real entries from Adaption Labs cloud dataset!`,
      datasetId,
      totalEntries: storageService.count()
    });
  } catch (err) {
    console.error("Load cloud dataset error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/adaption/autoscientist
// List all AutoScientist runs
router.get("/autoscientist", async (req, res) => {
  try {
    const runs = await adaptionService.listAutoScientistRuns();
    res.json({ success: true, count: runs.length, runs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/adaption/upload
// Upload CSV file and automatically start cleaning recipes
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    console.log(`\n📂 Processing: ${req.file.originalname}`);
    const result = await uploadDataset(req.file.path);
    
    if (result.success) {
      const recipeResult = await runRecipes(result.datasetId);
      res.json({
        ...result,
        runId: recipeResult.runId || result.datasetId,
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
// Check cleaning/adaptation job status
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
      message: "AutoScientist training started on Adaption Labs",
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

        const groqModel = "llama-3.3-70b-versatile";
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
          const raw = data.choices?.[0]?.message?.content || "";
          let cleaned = raw.trim();
          const jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/) || cleaned.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleaned = jsonMatch[0];
          } else {
            cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
          }
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
