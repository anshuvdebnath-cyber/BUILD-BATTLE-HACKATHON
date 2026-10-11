import { Router } from 'express';
import { storageService } from '../services/storageService.js';

const router = Router();

router.get('/', (req, res) => {
  const items = storageService.getAll();

  res.json({
    success: true,
    data: {
      totalFeedback: items.length,
      sentimentSplit: {
        positive: 45,
        neutral: 30,
        negative: 25
      },
      netSentiment: -0.64,
      trendAlert: 'Negative ↑18% Last 7 days — Action needed!',
      weeklyTrend: [
        { day: 'Mon', sentimentScore: 0.35, negativeShare: 18 },
        { day: 'Tue', sentimentScore: 0.28, negativeShare: 20 },
        { day: 'Wed', sentimentScore: 0.12, negativeShare: 22 },
        { day: 'Thu', sentimentScore: -0.05, negativeShare: 25 },
        { day: 'Fri', sentimentScore: -0.22, negativeShare: 28 },
        { day: 'Sat', sentimentScore: -0.48, negativeShare: 35 },
        { day: 'Sun', sentimentScore: -0.64, negativeShare: 43 }
      ],
      topIssues: [
        { id: '1', title: 'Fix Login Failures & OAuth', frequency: 187, sentiment: -0.82, impactScore: 9.2, priority: 'CRITICAL → FIX' },
        { id: '2', title: 'Slow Performance & Latency', frequency: 143, sentiment: -0.71, impactScore: 8.1, priority: 'HIGH → PLAN' },
        { id: '3', title: 'Missing CSV Export of Reports', frequency: 89, sentiment: -0.58, impactScore: 6.5, priority: 'MEDIUM → MONITOR' },
        { id: '4', title: 'Marketplace Rogue Seller Scams', frequency: 215, sentiment: -0.96, impactScore: 9.8, priority: 'CRITICAL → FIX' }
      ]
    }
  });
});

export default router;
