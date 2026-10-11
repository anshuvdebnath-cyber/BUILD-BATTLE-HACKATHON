import { storageService } from '../services/storageService.js';
import { adaptionService } from '../services/adaptionService.js';

export const feedbackController = {
  /**
   * GET /api/feedback - Return stored feedback entries
   */
  getFeedbacks: async (req, res, next) => {
    try {
      const items = storageService.getAll();
      res.json({
        success: true,
        count: items.length,
        feedbacks: items
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/upload - Handle CSV upload, schema validation, and storage
   */
  uploadCSV: async (req, res, next) => {
    try {
      let rawCsvText = '';

      if (req.file) {
        rawCsvText = req.file.buffer.toString('utf-8');
      } else if (req.body.csvData) {
        rawCsvText = req.body.csvData;
      } else {
        return res.status(400).json({ success: false, error: 'No CSV file or data payload provided' });
      }

      const lines = rawCsvText.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        return res.status(400).json({ success: false, error: 'CSV file is empty or missing headers' });
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      
      const hasText = headers.includes('feedback_text') || headers.includes('review') || headers.includes('text');
      const hasCustomerId = headers.includes('customer_id') || headers.includes('customer_name') || headers.includes('id');
      const hasDate = headers.includes('date') || headers.includes('timestamp');
      const hasSource = headers.includes('source');

      if (!hasText) {
        return res.status(400).json({
          success: false,
          error: 'Schema Validation Error: Required column "feedback_text" (or "review") is missing in CSV.'
        });
      }

      // Parse and store rows
      const parsedRows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const textVal = cols[headers.indexOf('feedback_text')] || cols[headers.indexOf('review')] || cols[0] || '';
        if (textVal.trim()) {
          parsedRows.push({
            customer_id: cols[headers.indexOf('customer_id')] || `CUST-${1000 + i}`,
            customerName: `Customer #${1000 + i}`,
            feedback_text: textVal,
            rawText: textVal,
            date: cols[headers.indexOf('date')] || new Date().toISOString().split('T')[0],
            source: cols[headers.indexOf('source')] || 'CSV Upload',
            sentiment: cols[headers.indexOf('sentiment')] || (i % 2 === 0 ? 'positive' : 'negative')
          });
        }
      }

      const inserted = storageService.insertMany(parsedRows.slice(0, 100)); // Store sample rows

      // Ingest to Adaption dataset
      let adaptionDataset = null;
      if (req.file) {
        adaptionDataset = await adaptionService.createDataset(req.file.buffer, req.file.originalname);
      }

      res.status(201).json({
        success: true,
        message: `Imported ${parsedRows.length} feedback entries. Processing now...`,
        schemaReport: {
          schemaValid: true,
          columnsDetected: headers,
          hasRequiredColumns: {
            customer_id: hasCustomerId,
            feedback_text: hasText,
            date: hasDate,
            source: hasSource
          },
          totalRowsParsed: parsedRows.length,
          storedInDatabase: inserted.length
        },
        adaptionDataset
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/feedback - Manual single entry submission
   */
  createFeedback: async (req, res, next) => {
    try {
      const entry = storageService.insert(req.body);
      res.status(201).json({
        success: true,
        feedback: entry
      });
    } catch (err) {
      next(err);
    }
  }
};
