/**
 * In-Memory & Database Abstraction Service
 * 
 * Manages customer feedback entries adhering to the PRD 4.1 schema:
 * feedback_entries table (id, customer_id, text, source, date, created_at)
 * 
 * Can be swapped with pg / prisma / knex for PostgreSQL later.
 */

let feedbackEntries = [
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
