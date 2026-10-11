/**
 * Adaption Labs API Integration Service
 * 
 * Handles interaction with Adaption's Adaptive Data API & AutoScientist.
 * Reference: https://docs.adaptionlabs.ai/tutorials/adaptive-data-app-walkthrough/
 */

import dotenv from 'dotenv';
dotenv.config();

const ADAPTION_API_BASE = process.env.ADAPTION_API_BASE || 'https://api.adaptionlabs.ai/v1';
const ADAPTION_API_KEY = process.env.ADAPTION_API_KEY || '';

export const adaptionService = {
  /**
   * Check if Adaption API credentials are configured
   */
  hasApiKey: () => {
    return Boolean(ADAPTION_API_KEY && ADAPTION_API_KEY.trim().length > 0);
  },

  /**
   * Step 1: Upload raw CSV dataset to Adaption
   * POST /v1/datasets
   */
  createDataset: async (fileBuffer, filename = 'feedback.csv') => {
    if (!adaptionService.hasApiKey()) {
      console.log('[AdaptionService] Running in simulation mode (No ADAPTION_API_KEY provided)');
      return {
        id: `ds_${Date.now()}`,
        name: filename,
        status: 'ready',
        totalRows: 2453,
        createdAt: new Date().toISOString(),
        isSimulated: true
      };
    }

    try {
      const formData = new FormData();
      const blob = new Blob([fileBuffer], { type: 'text/csv' });
      formData.append('file', blob, filename);

      const response = await fetch(`${ADAPTION_API_BASE}/datasets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADAPTION_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Adaption API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('[AdaptionService] Error creating dataset:', err);
      throw err;
    }
  },

  /**
   * Step 2: Run cleaning recipes (Deduplication, Rephrasing, Normalization)
   * POST /v1/recipes/run
   */
  runCleaningRecipes: async (datasetId, recipes = {}) => {
    if (!adaptionService.hasApiKey()) {
      return {
        jobId: `job_recipe_${Date.now()}`,
        datasetId,
        metrics: {
          originalRows: 2453,
          duplicatesRemoved: 127,
          duplicatePercentage: '-5.2%',
          cleanedRows: 2326,
          qualityScore: 94,
          qualityLift: '+106.5%'
        },
        activeRecipes: {
          promptDeduplication: recipes.promptDeduplication ?? true,
          promptRephrasing: recipes.promptRephrasing ?? true,
          reasoningTraces: recipes.reasoningTraces ?? true
        },
        status: 'completed',
        isSimulated: true
      };
    }

    try {
      const response = await fetch(`${ADAPTION_API_BASE}/recipes/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADAPTION_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataset_id: datasetId,
          recipes: {
            deduplication: recipes.promptDeduplication ?? true,
            rephrase: recipes.promptRephrasing ?? true,
            reasoning_traces: recipes.reasoningTraces ?? true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Adaption recipe execution failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('[AdaptionService] Recipe execution error:', err);
      throw err;
    }
  },

  /**
   * Step 4: Fine-tune custom model via Adaption AutoScientist
   * POST /v1/autoscientist/finetune
   */
  startAutoScientistTraining: async (cleanedDatasetId, config = {}) => {
    if (!adaptionService.hasApiKey()) {
      return {
        trainingJobId: `as_job_${Date.now()}`,
        modelName: 'insightflow-custom-classifier-v1',
        status: 'training',
        iteration: '2/3',
        accuracy: 87.3,
        etaSeconds: 45,
        targetAccuracy: '85-95%',
        baseModel: config.baseModel || 'adaption-foundation-7b',
        message: 'This model learns YOUR business terminology & will classify all future feedback with 85%+ accuracy.',
        isSimulated: true
      };
    }

    try {
      const response = await fetch(`${ADAPTION_API_BASE}/autoscientist/finetune`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADAPTION_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataset_id: cleanedDatasetId,
          task: 'classification',
          output_schema: {
            sentiment: ['positive', 'neutral', 'negative'],
            topic: ['performance', 'pricing', 'billing', 'feature_request', 'fraud'],
            priority: ['critical', 'high', 'medium', 'low']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Adaption AutoScientist training failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('[AdaptionService] AutoScientist training error:', err);
      throw err;
    }
  },

  /**
   * Step 5: Classify incoming feedback using the trained custom model
   * POST /v1/models/{modelId}/predict
   */
  predictFeedback: async (modelId, feedbackText) => {
    if (!adaptionService.hasApiKey()) {
      const lower = feedbackText.toLowerCase();
      let sentiment = 'neutral';
      let priority = 'medium';
      let topic = 'general';

      if (lower.includes('login') || lower.includes('cannot sign in') || lower.includes('crash') || lower.includes('fraud')) {
        sentiment = 'negative';
        priority = 'critical';
        topic = lower.includes('fraud') ? 'fraud' : 'authentication';
      } else if (lower.includes('slow') || lower.includes('freeze') || lower.includes('latency')) {
        sentiment = 'negative';
        priority = 'high';
        topic = 'performance';
      } else if (lower.includes('export') || lower.includes('csv') || lower.includes('feature')) {
        sentiment = 'neutral';
        priority = 'medium';
        topic = 'feature_request';
      } else if (lower.includes('love') || lower.includes('great') || lower.includes('saved')) {
        sentiment = 'positive';
        priority = 'low';
        topic = 'praise';
      }

      return {
        feedbackText,
        predictedSentiment: sentiment,
        predictedTopic: topic,
        priorityLevel: priority,
        confidence: 0.94,
        isSimulated: true
      };
    }

    try {
      const response = await fetch(`${ADAPTION_API_BASE}/models/${modelId}/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADAPTION_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: feedbackText })
      });

      return await response.json();
    } catch (err) {
      console.error('[AdaptionService] Model prediction error:', err);
      throw err;
    }
  }
};
