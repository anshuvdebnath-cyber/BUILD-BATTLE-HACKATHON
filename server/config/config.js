import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  adaptionApiKey: process.env.ADAPTION_API_KEY || '',
  adaptionApiBase: process.env.ADAPTION_API_BASE || 'https://api.adaptionlabs.ai/v1',
  adaptionModelId: process.env.ADAPTION_MODEL_ID || 'insightflow-custom-classifier-v1',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
