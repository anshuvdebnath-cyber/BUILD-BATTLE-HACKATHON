import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  adaptionApiKey: process.env.ADAPTION_API_KEY || '',
  adaptionApiBase: process.env.ADAPTION_API_BASE || 'https://api.prod.adaptionlabs.ai/api/v1',
  adaptionModelId: process.env.ADAPTION_MODEL_ID || 'adaption_mistral_7b_instruct_cx_feedback_preferences_13088bd2',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
