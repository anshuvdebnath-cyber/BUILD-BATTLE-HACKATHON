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
      
      const isIdCol = (h) => {
        const clean = h.trim().toLowerCase();
        return clean === 'id' || clean.endsWith('_id') || clean.endsWith('id') || clean.endsWith('_num') || clean.endsWith('_no');
      };

      // Determine best text column index
      let textIdx = headers.findIndex(h => !isIdCol(h) && ['feedback_text', 'text', 'comment', 'review', 'feedback', 'message', 'body', 'description', 'content', 'issue'].includes(h));
      if (textIdx === -1) {
        textIdx = headers.findIndex(h => !isIdCol(h) && /(feedback|review|comment|text|message|body|description|content|complaint)/i.test(h));
      }
      if (textIdx === -1) {
        textIdx = headers.findIndex(h => !isIdCol(h));
      }

      if (textIdx === -1) {
        return res.status(400).json({
          success: false,
          error: 'Schema Validation Error: Required text/feedback column is missing in CSV.'
        });
      }

      const custIdx = headers.findIndex(h => /customer_id|customer|user_id|user|author|client|account|name/i.test(h));
      const dateIdx = headers.findIndex(h => /date|timestamp|time|created/i.test(h));
      const sourceIdx = headers.findIndex(h => /source|channel|medium|platform/i.test(h));
      const sentIdx = headers.findIndex(h => /^(sentiment|sentiment_type|polarity)$/i.test(h));

      // Parse and store rows
      const parsedRows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const textVal = cols[textIdx] || '';
        if (textVal.trim()) {
          const custVal = (custIdx !== -1 && cols[custIdx]) ? cols[custIdx] : `CUST-${1000 + i}`;
          parsedRows.push({
            customer_id: custVal,
            customerName: custVal.includes('CUST') ? `Account #${custVal.replace(/\D/g, '') || i}` : custVal,
            feedback_text: textVal,
            rawText: textVal,
            date: (dateIdx !== -1 && cols[dateIdx]) ? cols[dateIdx] : new Date().toISOString().split('T')[0],
            source: (sourceIdx !== -1 && cols[sourceIdx]) ? cols[sourceIdx] : 'CSV Upload',
            sentiment: (sentIdx !== -1 && cols[sentIdx]) ? cols[sentIdx] : (/crash|fail|slow|bug|broken|error|bad|issue/i.test(textVal) ? 'negative' : /love|great|awesome|fast|good|amazing/i.test(textVal) ? 'positive' : 'neutral')
          });
        }
      }

      // Wipe any previous dataset so the new upload is 100% computed fresh and live
      storageService.clear();
      const inserted = storageService.insertMany(parsedRows); // Store all rows live

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
            customer_id: custIdx !== -1,
            feedback_text: textIdx !== -1,
            date: dateIdx !== -1,
            source: sourceIdx !== -1
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
