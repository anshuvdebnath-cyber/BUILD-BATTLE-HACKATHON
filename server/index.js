import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adaptionRoutes from './src/routes/adaption.routes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { adaptionService } from './services/adaptionService.js';
import { storageService } from './services/storageService.js';

const app = express();

// Global Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'InsightFlow Backend API',
    version: '2.0.0',
    adaptionApiConnected: adaptionService.hasApiKey(),
    totalFeedbackEntries: storageService.count(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/upload', feedbackRoutes); // Alias for POST /api/upload
app.use('/api/adaption', adaptionRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🚀 InsightFlow Modular Backend running on port ${config.port}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/feedback`);
  console.log(`   - POST /api/feedback/upload`);
  console.log(`   - POST /api/adaption/clean`);
  console.log(`   - POST /api/adaption/train`);
  console.log(`   - GET  /api/adaption/training-status`);
  console.log(`   - POST /api/adaption/predict`);
  console.log(`   - GET  /api/analytics`);
  console.log(`🔑 Adaption API Key: ${adaptionService.hasApiKey() ? 'CONFIGURED' : 'SIMULATION MODE'}`);
  console.log('====================================================');
});

export default app;
