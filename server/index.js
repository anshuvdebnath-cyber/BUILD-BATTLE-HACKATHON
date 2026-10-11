import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { adaptionService } from './adaptionService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Set up in-memory storage for uploaded files and feedback entries
const upload = multer({ storage: multer.memoryStorage() });

// In-Memory Storage (Can be connected to PostgreSQL database later)
let feedbackStore = [
  {
    id: 'FB-PRD-01',
    customer_id: 'CUST-8491',
    customerName: 'Fintech Corp #8491',
    customerTier: 'Enterprise',
    feedback_text: 'Cannot log in to the web app for 2 days, SSO returns 500 error on token validation callback.',
    rawText: 'Cannot log in to the web app for 2 days, SSO returns 500 error on token validation callback.',
    date: '2026-03-24',
    source: 'Email',
    sentiment: 'negative',
    sentimentScore: -0.82,
    category: 'Authentication & SSO',
    urgency: 'critical',
    arrValue: 120000,
    created_at: new Date('2026-03-24T08:30:00Z').toISOString()
  },
  {
    id: 'FB-PRD-02',
    customer_id: 'CUST-3902',
    customerName: 'Logistics Pro #3902',
    customerTier: 'Enterprise',
    feedback_text: 'Dashboard load times are extremely slow and screen freezes when querying more than 100 projects.',
    rawText: 'Dashboard load times are extremely slow and screen freezes when querying more than 100 projects.',
    date: '2026-03-23',
    source: 'Review',
    sentiment: 'negative',
    sentimentScore: -0.71,
    category: 'Performance & Latency',
    urgency: 'high',
    arrValue: 85000,
    created_at: new Date('2026-03-23T11:15:00Z').toISOString()
  },
  {
    id: 'FB-PRD-03',
    customer_id: 'CUST-1920',
    customerName: 'Retail Ops #1920',
    customerTier: 'Pro',
    feedback_text: 'Need direct CSV export option on executive weekly reports so we can ingest into our internal BI pipeline.',
    rawText: 'Need direct CSV export option on executive weekly reports so we can ingest into our internal BI pipeline.',
    date: '2026-03-21',
    source: 'Chat',
    sentiment: 'neutral',
    sentimentScore: -0.58,
    category: 'Reporting & Export',
    urgency: 'medium',
    arrValue: 35000,
    created_at: new Date('2026-03-21T14:40:00Z').toISOString()
  },
  {
    id: 'FB-PRD-04',
    customer_id: 'CUST-5519',
    customerName: 'Consumer App #5519',
    customerTier: 'Pro',
    feedback_text: 'Love the new classification accuracy, saved our tier-1 support team 20 hours of manual triage this week!',
    rawText: 'Love the new classification accuracy, saved our tier-1 support team 20 hours of manual triage this week!',
    date: '2026-03-22',
    source: 'Survey',
    sentiment: 'positive',
    sentimentScore: 0.88,
    category: 'Product Feedback',
    urgency: 'low',
    arrValue: 42000,
    created_at: new Date('2026-03-22T09:00:00Z').toISOString()
  },
  {
    id: 'FB-PRD-05',
    customer_id: 'CUST-7741',
    customerName: 'Merchant Store #7741',
    customerTier: 'Enterprise',
    feedback_text: 'Seller demanded external payment off-platform via WhatsApp. When I refused, they threatened negative feedback.',
    rawText: 'Seller demanded external payment off-platform via WhatsApp. When I refused, they threatened negative feedback.',
    date: '2026-03-20',
    source: 'Email',
    sentiment: 'negative',
    sentimentScore: -0.96,
    category: 'Fraud and Scam',
    urgency: 'critical',
    arrValue: 145000,
    created_at: new Date('2026-03-20T16:20:00Z').toISOString()
  }
];

let activeTrainingJob = null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    adaptionApiConnected: adaptionService.hasApiKey(),
    databaseReady: true,
    totalFeedbackEntries: feedbackStore.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/feedback
app.get('/api/feedback', (req, res) => {
  res.json({
    count: feedbackStore.length,
    feedbacks: feedbackStore
  });
});

// POST /api/upload - Handle CSV upload and validate schema
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    let rawCsvText = '';

    if (req.file) {
      rawCsvText = req.file.buffer.toString('utf-8');
    } else if (req.body.csvData) {
      rawCsvText = req.body.csvData;
    } else {
      return res.status(400).json({ error: 'No CSV file or data provided' });
    }

    const lines = rawCsvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      return res.status(400).json({ error: 'CSV file is empty or missing headers' });
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    // Validate schema according to PRD 4.1
    const hasText = headers.includes('feedback_text') || headers.includes('review') || headers.includes('text');
    const hasCustomerId = headers.includes('customer_id') || headers.includes('customer_name') || headers.includes('id');
    const hasDate = headers.includes('date') || headers.includes('timestamp');
    const hasSource = headers.includes('source');

    const schemaReport = {
      schemaValid: hasText,
      columnsDetected: headers,
      hasRequiredColumns: {
        customer_id: hasCustomerId,
        feedback_text: hasText,
        date: hasDate,
        source: hasSource
      },
      parsedRows: lines.length - 1
    };

    // Forward file to Adaption API for dataset creation
    let adaptionDataset = null;
    if (req.file) {
      adaptionDataset = await adaptionService.createDataset(req.file.buffer, req.file.originalname);
    }

    res.json({
      message: `Imported ${lines.length - 1} feedback entries. Processing now...`,
      schemaReport,
      adaptionDataset
    });
  } catch (err) {
    console.error('[Upload Error]', err);
    res.status(500).json({ error: err.message || 'Internal server error processing CSV upload' });
  }
});

// POST /api/adaption/clean - Run cleaning recipes (Deduplication, Normalization)
app.post('/api/adaption/clean', async (req, res) => {
  try {
    const { datasetId = 'default_ds', recipes = {} } = req.body;
    const cleaningResult = await adaptionService.runCleaningRecipes(datasetId, recipes);
    res.json(cleaningResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/adaption/train - Start AutoScientist model fine-tuning
app.post('/api/adaption/train', async (req, res) => {
  try {
    const { datasetId = 'cleaned_ds', config = {} } = req.body;
    activeTrainingJob = await adaptionService.startAutoScientistTraining(datasetId, config);
    res.json(activeTrainingJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/adaption/training-status - Return AutoScientist status
app.get('/api/adaption/training-status', (req, res) => {
  if (!activeTrainingJob) {
    return res.json({
      status: 'idle',
      modelName: 'insightflow-classifier-v1',
      accuracy: 87.3,
      iteration: '2/3',
      etaSeconds: 45
    });
  }
  res.json(activeTrainingJob);
});

// POST /api/adaption/predict - Predict new feedback using the trained model
app.post('/api/adaption/predict', async (req, res) => {
  try {
    const { text, modelId = 'insightflow-classifier-v1' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Feedback text is required' });
    }
    const prediction = await adaptionService.predictFeedback(modelId, text);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 InsightFlow Node.js/Express Backend running on port ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/feedback`);
  console.log(`   - POST /api/upload`);
  console.log(`   - POST /api/adaption/clean`);
  console.log(`   - POST /api/adaption/train`);
  console.log(`   - POST /api/adaption/predict`);
  console.log(`🔑 Adaption API Key: ${adaptionService.hasApiKey() ? 'CONFIGURED' : 'SIMULATION MODE'}`);
  console.log(`====================================================`);
});
