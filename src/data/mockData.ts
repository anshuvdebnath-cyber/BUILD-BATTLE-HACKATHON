import { FeedbackItem, RecommendationItem, AdaptionQualityMetrics } from '../types';

export const HACKATHON_OFFICIAL_DATASET: FeedbackItem[] = [
  {
    id: 'HK-001',
    customerName: 'Marcus Sterling (Customer #1042)',
    customerEmail: 'm.sterling@consumer.net',
    customerTier: 'Enterprise',
    source: 'CSV Upload',
    rating: 1,
    rawText: 'I was a victim of fraud, the seller requested additional payment after purchase and never shipped the item.',
    sentiment: 'negative',
    sentimentScore: -0.96,
    category: 'Fraud and Scam',
    urgency: 'critical',
    arrValue: 145000,
    timestamp: '2026-10-11T16:20:00Z',
    adaptedPrompt: 'Seller extortion: Post-purchase demand for off-platform payment fees.',
    adaptedContext: 'Category: Fraud and Scam. Marketplace Seller Tier: Unverified 3rd-Party.',
    adaptedCompletion: 'Root cause: Unvetted marketplace seller exploiting checkout messaging. Action: Immediate seller account freeze and automated escrow block on fee requests.',
    reasoningTrace: 'Buyer pays on platform -> Seller messages requesting wire fee -> Seller defaults on fulfillment -> Platform chargeback risk.',
    dedupClusterId: 'FRAUD-EXTORTION-FEE',
    isDeduplicated: false,
  },
  {
    id: 'HK-002',
    customerName: 'Sophia Lin (Customer #1088)',
    customerEmail: 'sophia.lin@enterprise.org',
    customerTier: 'Enterprise',
    source: 'CSV Upload',
    rating: 1,
    rawText: 'Beware of fraudulent activities, I never received my order despite being charged multiple times.',
    sentiment: 'negative',
    sentimentScore: -0.94,
    category: 'Fraud and Scam',
    urgency: 'critical',
    arrValue: 120000,
    timestamp: '2026-10-11T15:10:00Z',
    adaptedPrompt: 'Double-billing combined with zero merchant order fulfillment dispatch.',
    adaptedContext: 'Category: Fraud and Scam. Gateway: Payment API. Duplicate pattern of HK-001.',
    adaptedCompletion: 'Root cause: Payment gateway idempotency failure paired with fraudulent merchant. Action: Automated refund disbursement.',
    reasoningTrace: 'Identical fraud signature grouped by Adaption Prompt Deduplication recipe.',
    dedupClusterId: 'FRAUD-EXTORTION-FEE',
    isDeduplicated: true,
  },
  {
    id: 'HK-003',
    customerName: 'David K. O\'Connor',
    customerEmail: 'david.oc@logistics-corp.com',
    customerTier: 'Enterprise',
    source: 'CSV Upload',
    rating: 1,
    rawText: 'The delivery was delayed by two weeks, which was very inconvenient, and the packaging was damaged upon arrival.',
    sentiment: 'negative',
    sentimentScore: -0.85,
    category: 'Operational Issues',
    urgency: 'critical',
    arrValue: 210000,
    timestamp: '2026-10-10T12:00:00Z',
    adaptedPrompt: 'Severe logistics delivery delay (14+ days) accompanied by transit packaging destruction.',
    adaptedContext: 'Category: Operational Issues. Carrier: Regional Ground Freight.',
    adaptedCompletion: 'Root cause: Carrier distribution center bottleneck and inadequate warehouse protective packaging. Action: Re-route volume to expedited tier and enforce box reinforcement guidelines.',
    reasoningTrace: 'Warehouse handover delayed -> Secondary regional hub queue saturation -> 14-day hold -> Transit impact damage.',
    dedupClusterId: 'OPS-DELIVERY-DELAY-14D',
    isDeduplicated: false,
  },
  {
    id: 'HK-004',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@fashionretail.com',
    customerTier: 'Pro',
    source: 'CSV Upload',
    rating: 2,
    rawText: 'There were glitches on the website, making it difficult to complete my purchase. It kept crashing during cart checkout.',
    sentiment: 'negative',
    sentimentScore: -0.78,
    category: 'Operational Issues',
    urgency: 'high',
    arrValue: 95000,
    timestamp: '2026-10-10T14:40:00Z',
    adaptedPrompt: 'Web storefront checkout session crash during cart finalization phase.',
    adaptedContext: 'Category: Operational Issues. Client: Desktop Chrome / Mobile Safari.',
    adaptedCompletion: 'Root cause: JavaScript memory leak on cart state reconciliation during promo calculation. Action: Refactor checkout state hook and add synthetic uptime monitors.',
    reasoningTrace: 'User navigates to cart -> Memory allocation spike on coupon validator -> Browser tab freezes -> Checkout abandoned.',
    dedupClusterId: 'OPS-WEB-CHECKOUT-CRASH',
    isDeduplicated: false,
  },
  {
    id: 'HK-005',
    customerName: 'James Henderson',
    customerEmail: 'j.henderson@globaltech.com',
    customerTier: 'Pro',
    source: 'CSV Upload',
    rating: 1,
    rawText: 'Customer service was unresponsive to my inquiry. I had to wait for a long time to get a response and my issue remains unresolved.',
    sentiment: 'negative',
    sentimentScore: -0.89,
    category: 'Customer Service',
    urgency: 'high',
    arrValue: 85000,
    timestamp: '2026-10-09T11:20:00Z',
    adaptedPrompt: 'Tier-1 Customer Support inquiry unassigned for >48 hours without SLA breach escalation.',
    adaptedContext: 'Category: Customer Service. Queue: Email Ticketing.',
    adaptedCompletion: 'Root cause: Automated routing queue backlog and missing priority auto-escalation tags. Action: Implement AI triage router to fast-track high-ARR account tickets to human leads.',
    reasoningTrace: 'Ticket submitted -> Keyword routing fails to tag severity -> Ticket sits in unassigned queue -> Customer churn risk.',
    dedupClusterId: 'CS-UNRESPONSIVE-TICKET',
    isDeduplicated: false,
  },
  {
    id: 'HK-006',
    customerName: 'Aria Montgomery',
    customerEmail: 'aria.m@designstudio.io',
    customerTier: 'Pro',
    source: 'CSV Upload',
    rating: 5,
    rawText: 'The product\'s innovative features have greatly improved my daily tasks. Exceeded all my expectations in terms of quality!',
    sentiment: 'positive',
    sentimentScore: 0.94,
    category: 'Product Feedback',
    urgency: 'low',
    arrValue: 45000,
    timestamp: '2026-10-09T18:00:00Z',
    adaptedPrompt: 'High customer delight regarding innovative product utility and build durability.',
    adaptedContext: 'Category: Product Feedback. Feature: Core workflow tools.',
    adaptedCompletion: 'Strategic insight: Core feature quality has strong product-market fit. Double-down on feature promotion in onboarding tutorials.',
    reasoningTrace: 'Feature solves direct user problem -> High positive CSAT correlation -> Organic referral potential.',
    dedupClusterId: 'PROD-INNOVATION-PRAISE',
    isDeduplicated: false,
  },
  {
    id: 'HK-007',
    customerName: 'Liam Chen',
    customerEmail: 'liam.chen@fintechgroup.cn',
    customerTier: 'Enterprise',
    source: 'CSV Upload',
    rating: 5,
    rawText: 'Customer service was incredibly helpful and resolved my issue within minutes. Outstanding assistance!',
    sentiment: 'positive',
    sentimentScore: 0.96,
    category: 'Customer Service',
    urgency: 'low',
    arrValue: 110000,
    timestamp: '2026-10-08T09:30:00Z',
    adaptedPrompt: 'Commendation of rapid resolution speed (<5 minutes) by customer support representatives.',
    adaptedContext: 'Category: Customer Service. Live chat resolution tier.',
    adaptedCompletion: 'Benchmark standard: Sub-5 minute live agent responses generate maximum retention loyalty.',
    reasoningTrace: 'Immediate human intervention prevents issue escalation -> 5-star customer review.',
    dedupClusterId: 'CS-SPEED-PRAISE',
    isDeduplicated: false,
  },
  {
    id: 'HK-008',
    customerName: 'Rachel Green',
    customerEmail: 'rachel@boutique.co',
    customerTier: 'Starter',
    source: 'CSV Upload',
    rating: 1,
    rawText: 'Unfortunately, the product did not meet my expectations. It stopped working after a week.',
    sentiment: 'negative',
    sentimentScore: -0.75,
    category: 'Product Feedback',
    urgency: 'medium',
    arrValue: 35000,
    timestamp: '2026-10-08T14:15:00Z',
    adaptedPrompt: 'Hardware/software operational breakdown occurring after 7 days of active usage.',
    adaptedContext: 'Category: Product Feedback. Lifespan failure.',
    adaptedCompletion: 'Root cause: Early lifecycle component failure or unhandled edge-case exception. Action: Conduct QA burn-in testing on batch #4.',
    reasoningTrace: 'Unit passes factory check -> Fails under 1 week sustained load -> Quality assurance gap.',
    dedupClusterId: 'PROD-EARLY-FAILURE',
    isDeduplicated: false,
  }
];

export const HACKATHON_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'REC-PRD-01',
    title: 'Fix Login Failures & OAuth Misconfiguration',
    category: 'Authentication & SSO',
    severity: 'Critical',
    priorityScore: 92,
    frequencyMentions: 187,
    frequencyPercentage: '7.8% of all feedback',
    sentimentScore: -0.82,
    affectedCustomersCount: 340,
    affectedCustomersPercent: '~340 (14% of user base)',
    revenueImpactMonthly: '$47K/month',
    totalArrAtRisk: 564000,
    actionType: 'Fix',
    rootCauseAnalysis: 'OAuth token validation endpoint timeout paired with 2FA session misconfiguration in mobile client release v2.4.1.',
    recommendedAction: 'Verify 2FA flow in staging/QA, inspect OAuth logs in Sentry dashboard, broadcast customer status update, and deploy hotfix within 4 hours.',
    sampleFeedback: [
      "Can't sign in for 2 days, very frustrating",
      "Login button does nothing on iOS Safari",
      "MFA keeps failing with invalid token after update"
    ],
    evidenceQuotes: [
      {
        customerName: 'Marcus Sterling (Customer #1042)',
        tier: 'Enterprise',
        quote: "Can't sign in for 2 days, very frustrating"
      },
      {
        customerName: 'Rachel Green',
        tier: 'Pro',
        quote: "Login button does nothing after entering password"
      }
    ],
    status: 'in_progress',
    assignee: 'SecOps & Identity Team',
    estimatedDaysToFix: 1,
    expectedCSATLift: '+42% login completion rate and recovery of $47K/mo recurring revenue',
    playbook: {
      id: 'PB-PRD-01',
      recommendationId: 'REC-PRD-01',
      title: 'Incident SOP: Fix Login Failures & OAuth Timeout',
      category: 'Authentication & SSO',
      severity: 'Critical',
      targetSLA: '< 4 Hours',
      rootCauseClassification: 'OAuth provider timeout & 2FA misconfiguration',
      steps: [
        {
          stepNumber: 1,
          title: 'Check OAuth Logs in Sentry',
          instruction: 'Filter Sentry error stream by auth.oauth.token_exchange_failure and review rate limiting spikes.',
          ownerRole: 'DevOps / SecOps Lead'
        },
        {
          stepNumber: 2,
          title: 'Verify 2FA Flow in QA',
          instruction: 'Execute automated regression suite against TOTP and SMS 2FA handshakes across iOS and Android.',
          ownerRole: 'QA Automation Lead'
        },
        {
          stepNumber: 3,
          title: 'Post Status Update to Customers',
          instruction: 'Publish incident advisory on status page and email impacted accounts with zero-friction workaround.',
          ownerRole: 'Customer Success Operations'
        },
        {
          stepNumber: 4,
          title: 'Deploy Hotfix & Verify Rollout',
          instruction: 'Push canary patch with renewed connection pool and verify error drop below 0.01%.',
          ownerRole: 'Backend Core Team'
        }
      ],
      customerResponseTemplate: 'Subject: Update on Login & Authentication Access\n\nHi [Customer Name],\n\nWe identified an issue impacting login and MFA verification on version 2.4.1. Our engineering team has isolated the root cause and deployed a hotfix. Your account access has been fully restored.\n\nIf you experience any lingering friction, please reply directly to this email and our lead engineer will assist you personally.\n\nBest regards,\nInsightFlow Engineering Support',
      preventionMeasure: 'Enable synthetic OAuth login health checks every 60 seconds with PagerDuty escalation.'
    }
  },
  {
    id: 'REC-PRD-02',
    title: 'Resolve Performance Degradation & Latency',
    category: 'Performance & Latency',
    severity: 'High',
    priorityScore: 81,
    frequencyMentions: 143,
    frequencyPercentage: '5.9% of all feedback',
    sentimentScore: -0.71,
    affectedCustomersCount: 280,
    affectedCustomersPercent: '~280 (11% of user base)',
    revenueImpactMonthly: '$32K/month',
    totalArrAtRisk: 384000,
    actionType: 'Plan',
    rootCauseAnalysis: 'Unindexed database query table scan on large project workspaces (>100 projects) during data export and dashboard load.',
    recommendedAction: 'Profile application with enterprise datasets (>100 projects), review database query performance, and deploy Redis caching layer for heavy aggregate metrics.',
    sampleFeedback: [
      "Dashboard loads really slowly when viewing historical quarters",
      "Takes 10+ seconds to export data to spreadsheet",
      "App freezes when I have >100 projects loaded"
    ],
    evidenceQuotes: [
      {
        customerName: 'David K. O\'Connor',
        tier: 'Enterprise',
        quote: "Dashboard loads really slowly and takes 10+ seconds to export data"
      },
      {
        customerName: 'Elena Rostova',
        tier: 'Pro',
        quote: "App freezes when I have >100 projects active"
      }
    ],
    status: 'backlog',
    assignee: 'Database & Infrastructure Lead',
    estimatedDaysToFix: 3,
    expectedCSATLift: '+65% p99 page load speed improvement (< 800ms)',
    playbook: {
      id: 'PB-PRD-02',
      recommendationId: 'REC-PRD-02',
      title: 'Incident SOP: Remediate Dashboard Performance Degradation',
      category: 'Performance & Latency',
      severity: 'High',
      targetSLA: '< 48 Hours',
      rootCauseClassification: 'Unindexed PostgreSQL query scans on project workspaces',
      steps: [
        {
          stepNumber: 1,
          title: 'Profile App with New Large Dataset',
          instruction: 'Simulate high concurrency with synthetic accounts holding >100 projects to replicate bottleneck.',
          ownerRole: 'Performance Eng Lead'
        },
        {
          stepNumber: 2,
          title: 'Review Database Query Performance',
          instruction: 'Analyze EXPLAIN ANALYZE traces on workspace aggregations and add composite indexes.',
          ownerRole: 'Database Administrator'
        },
        {
          stepNumber: 3,
          title: 'Implement Redis Caching Strategy',
          instruction: 'Cache precomputed quarterly analytics rollups with 15-minute invalidation TTL.',
          ownerRole: 'Backend Lead'
        }
      ],
      customerResponseTemplate: 'Subject: Performance Improvements to Your InsightFlow Workspace\n\nHi [Customer Name],\n\nThank you for flagging the latency in your workspace. We have rolled out database indexing and caching optimizations that reduce dashboard load times by over 65%.\n\nPlease check your dashboard now for immediate speed improvements.\n\nBest regards,\nInsightFlow Performance Team',
      preventionMeasure: 'Set query execution threshold alert for queries exceeding 250ms.'
    }
  },
  {
    id: 'REC-PRD-03',
    title: 'Prioritize CSV Report Export Feature Request',
    category: 'Reporting & Export',
    severity: 'Medium',
    priorityScore: 65,
    frequencyMentions: 89,
    frequencyPercentage: '3.7% of all feedback',
    sentimentScore: -0.58,
    affectedCustomersCount: 195,
    affectedCustomersPercent: '~195 (8% of user base)',
    revenueImpactMonthly: '$18K/month (upsell value)',
    totalArrAtRisk: 216000,
    actionType: 'Roadmap',
    rootCauseAnalysis: 'Customers currently only have PDF print exports available, preventing business analysts from analyzing raw numbers in Excel/Google Sheets.',
    recommendedAction: 'Scope CSV/Excel streaming exporter endpoint, add 1-click Download CSV button to analytics reports, and prioritize in upcoming sprint.',
    sampleFeedback: [
      "Customers want CSV export of reports for executive board slides",
      "Need raw data download option, PDF is not sufficient for modeling",
      "Please add bulk export for monthly feedback batches"
    ],
    evidenceQuotes: [
      {
        customerName: 'James Henderson',
        tier: 'Pro',
        quote: "Need CSV export of reports for our weekly finance meeting"
      }
    ],
    status: 'backlog',
    assignee: 'Product Management Lead',
    estimatedDaysToFix: 5,
    expectedCSATLift: '+18% NPS lift among Business Analysts and Finance Leads'
  },
  {
    id: 'REC-HK-01',
    title: 'Deploy Automated Fraud Detection & Rogue Seller Escrow Hold',
    category: 'Fraud and Scam',
    severity: 'Critical',
    priorityScore: 98,
    frequencyMentions: 215,
    frequencyPercentage: '8.9% of all feedback',
    sentimentScore: -0.96,
    affectedCustomersCount: 42,
    affectedCustomersPercent: '~42 Enterprise Accounts',
    revenueImpactMonthly: '$22K/month',
    totalArrAtRisk: 385000,
    actionType: 'Fix',
    rootCauseAnalysis: 'Unverified third-party sellers exploiting platform chat to demand extra off-platform wire transfers, leading to counterfeit deliveries and chargeback surges.',
    recommendedAction: 'Implement real-time chat regex filters to flag external payment requests, freeze seller payout escrows on suspicious patterns, and mandate identity KYC verification.',
    sampleFeedback: [
      "I was a victim of fraud, the seller requested additional payment after purchase and never shipped the item.",
      "Beware of fraudulent activities, I never received my order despite being charged multiple times."
    ],
    evidenceQuotes: [
      {
        customerName: 'Marcus Sterling (Customer #1042)',
        tier: 'Enterprise',
        quote: 'I was a victim of fraud, the seller requested additional payment after purchase.'
      },
      {
        customerName: 'Sophia Lin (Customer #1088)',
        tier: 'Enterprise',
        quote: 'Beware of fraudulent activities, I never received my order despite being charged.'
      }
    ],
    status: 'in_progress',
    assignee: 'Security & Risk Trust Team',
    estimatedDaysToFix: 2,
    expectedCSATLift: '+35% reduction in fraud disputes and credit card chargebacks',
    playbook: {
      id: 'PB-HK-01',
      recommendationId: 'REC-HK-01',
      title: 'Deploy Automated Fraud Detection & Rogue Seller Escrow Hold',
      category: 'Fraud and Scam',
      severity: 'Critical',
      targetSLA: '< 30 Minutes',
      rootCauseClassification: 'Unvetted marketplace seller extortion & payment chargebacks',
      steps: [
        {
          stepNumber: 1,
          title: 'Escrow Freeze & Rogue Vendor Isolation',
          instruction: 'Immediately freeze merchant account payout escrow and isolate transaction settlement IDs.',
          ownerRole: 'Risk & Trust Operations'
        },
        {
          stepNumber: 2,
          title: 'Consumer Notification & Biometric Step-Up',
          instruction: 'Send instant SMS/Email security notice advising customer of zero liability and reset session tokens.',
          ownerRole: 'Customer Support Lead'
        },
        {
          stepNumber: 3,
          title: 'KYC & Device Fingerprint Heuristic Patch',
          instruction: 'Update Adaptive intent classifier to detect synthetic ID velocity and blacklisted IP subnets.',
          ownerRole: 'Fraud Machine Learning Team'
        },
        {
          stepNumber: 4,
          title: 'Full Financial Recovery Reconciliation',
          instruction: 'Reverse unauthorized charges, reimburse dispute fees, and provide audited incident brief.',
          ownerRole: 'Payment Operations & Finance'
        }
      ],
      customerResponseTemplate: 'Subject: Urgent Notice Regarding Your Recent Order & Escrow Security\n\nDear Customer,\n\nOur Trust & Safety monitoring detected suspicious activity associated with your recent order. The seller account has been permanently suspended, and your payment was preserved in platform escrow.\n\nA full refund has been initiated back to your original payment method. No further action is required on your part.\n\nSincerely,\nInsightFlow Trust & Safety Operations',
      preventionMeasure: 'Auto-hold payouts for new sellers exceeding $2,500 in 24 hours until KYC verification.'
    }
  }
];

export const HACKATHON_QUALITY_METRICS: AdaptionQualityMetrics = {
  baselineGrade: 'C-',
  baselineScore: 4.6,
  baselinePercentile: 32,
  adaptedGrade: 'A+',
  adaptedScore: 9.5,
  adaptedPercentile: 98,
  qualityLiftPercentage: 106.5,
  totalRowsProcessed: 1250,
  duplicateRowsEliminated: 840,
  domainDetected: 'Consumer Marketplace & Multi-Vendor E-Commerce',
  languageDetected: 'English (High Duplication Density Cleared)',
};
