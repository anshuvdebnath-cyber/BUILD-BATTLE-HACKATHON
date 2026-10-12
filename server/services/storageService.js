/**
 * In-Memory & Database Abstraction Service
 * 
 * Manages customer feedback entries adhering to the PRD 4.1 schema:
 * feedback_entries table (id, customer_id, text, source, date, created_at)
 * 
 * Can be swapped with pg / prisma / knex for PostgreSQL later.
 */

// Empty initial state - populated dynamically when CSV is uploaded or feedback is submitted
let feedbackEntries = [];

export const storageService = {
  getAll: () => {
    return [...feedbackEntries];
  },

  getById: (id) => {
    return feedbackEntries.find(item => item.id === id) || null;
  },

  insert: (entry) => {
    const newEntry = {
      id: entry.id || `FB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customer_id: entry.customer_id || entry.customerId || 'CUST-GEN',
      customerName: entry.customerName || 'Anonymous Customer',
      customerTier: entry.customerTier || 'Pro',
      feedback_text: entry.feedback_text || entry.rawText || '',
      rawText: entry.rawText || entry.feedback_text || '',
      date: entry.date || new Date().toISOString().split('T')[0],
      source: entry.source || 'CSV Upload',
      sentiment: entry.sentiment || 'neutral',
      sentimentScore: entry.sentimentScore || 0,
      category: entry.category || 'Product Feedback',
      urgency: entry.urgency || 'medium',
      arrValue: entry.arrValue || 25000,
      created_at: new Date().toISOString()
    };
    feedbackEntries.unshift(newEntry);
    return newEntry;
  },

  insertMany: (entries) => {
    const formatted = entries.map((entry, idx) => ({
      id: entry.id || `FB-${Date.now()}-${idx}`,
      customer_id: entry.customer_id || entry.customerId || `CUST-${1000 + idx}`,
      customerName: entry.customerName || `Customer #${1000 + idx}`,
      customerTier: entry.customerTier || 'Pro',
      feedback_text: entry.feedback_text || entry.rawText || '',
      rawText: entry.rawText || entry.feedback_text || '',
      date: entry.date || new Date().toISOString().split('T')[0],
      source: entry.source || 'CSV Upload',
      sentiment: entry.sentiment || 'neutral',
      sentimentScore: entry.sentimentScore || 0,
      category: entry.category || 'Product Feedback',
      urgency: entry.urgency || 'medium',
      arrValue: entry.arrValue || 25000,
      created_at: new Date().toISOString()
    }));

    feedbackEntries = [...formatted, ...feedbackEntries];
    return formatted;
  },

  count: () => {
    return feedbackEntries.length;
  }
};
