import { adaptionService } from '../services/adaptionService.js';

let currentTrainingJob = null;

export const adaptionController = {
  /**
   * POST /api/adaption/clean - Trigger cleaning recipes
   */
  cleanData: async (req, res, next) => {
    try {
      const { datasetId = 'dataset_primary', recipes = {} } = req.body;
      const result = await adaptionService.runCleaningRecipes(datasetId, recipes);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/adaption/train - Start AutoScientist fine-tuning
   */
  trainModel: async (req, res, next) => {
    try {
      const { datasetId = 'cleaned_dataset', config = {} } = req.body;
      currentTrainingJob = await adaptionService.startAutoScientistTraining(datasetId, config);
      res.status(202).json({
        success: true,
        job: currentTrainingJob
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/adaption/training-status - Poll AutoScientist training status
   */
  getTrainingStatus: async (req, res) => {
    if (!currentTrainingJob) {
      return res.json({
        success: true,
        job: {
          status: 'idle',
          modelName: 'insightflow-custom-classifier-v1',
          accuracy: 87.3,
          iteration: '2/3',
          etaSeconds: 45
        }
      });
    }
    res.json({
      success: true,
      job: currentTrainingJob
    });
  },

  /**
   * POST /api/adaption/predict - Predict new feedback using the trained model
   */
  predict: async (req, res, next) => {
    try {
      const { text, modelId = 'insightflow-custom-classifier-v1' } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'Feedback text is required for prediction' });
      }
      const prediction = await adaptionService.predictFeedback(modelId, text);
      res.json({
        success: true,
        prediction
      });
    } catch (err) {
      next(err);
    }
  }
};
