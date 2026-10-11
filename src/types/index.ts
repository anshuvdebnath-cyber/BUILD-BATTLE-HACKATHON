export type CustomerTier = 'Enterprise' | 'Pro' | 'Starter' | 'Free';

export type FeedbackSource = 
  | 'Review'
  | 'Survey'
  | 'Support'
  | 'Email'
  | 'Chat'
  | 'Zendesk Ticket' 
  | 'App Store Review' 
  | 'Customer Survey' 
  | 'Intercom Chat' 
  | 'Sales Call Notes'
  | 'CSV Upload';

export type SentimentType = 'positive' | 'negative' | 'neutral' | 'mixed';

export type IssueCategory = 
  | 'Reliability'
  | 'Performance'
  | 'Pricing'
  | 'UI/UX'
  | 'Support'
  | 'Features'
  | 'Onboarding'
  | 'Fraud and Scam'
  | 'Operational Issues'
  | 'Customer Service'
  | 'Product Feedback'
  | 'Billing & Invoicing' 
  | 'API & Webhooks' 
  | 'Performance & Latency' 
  | 'Authentication & SSO' 
  | 'UI & Usability' 
  | 'Reporting & Export';


export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface FeedbackItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerTier: CustomerTier;
  source: FeedbackSource;
  rating: number; // 1 to 5
  rawText: string;
  sentiment: SentimentType;
  sentimentScore: number; // -1.0 to 1.0
  category: IssueCategory;
  urgency: UrgencyLevel;
  arrValue: number; // Annual recurring revenue associated with account
  timestamp: string;
  customerId?: string;
  date?: string;
  
  // Adaption Step 2 & 4 Enrichments
  adaptedPrompt?: string;
  adaptedContext?: string;
  adaptedCompletion?: string;
  reasoningTrace?: string;
  dedupClusterId?: string;
  isDeduplicated?: boolean;
}

export interface AdaptionRecipeSettings {
  promptDeduplication: boolean;
  promptRephrasing: boolean;
  reasoningTraces: boolean;
  hallucinationMitigation: boolean;
  brandVoiceSteering: boolean;
  metadataInjection: boolean;
}

export interface AdaptionBlueprint {
  systemPrompt: string;
  brandVoiceTone: 'Warm & Professional' | 'Strict Technical' | 'Direct & Minimal';
  lengthConstraint: 'Concise' | 'Detailed' | 'Minimal' | 'Extensive';
  safetyClassification: boolean;
  groundingThreshold: number; // 0 to 100
}

export interface AdaptionQualityMetrics {
  baselineGrade: string;
  baselineScore: number; // 0.0 - 10.0
  baselinePercentile: number; // 0 - 100
  
  adaptedGrade: string;
  adaptedScore: number;
  adaptedPercentile: number;
  
  qualityLiftPercentage: number;
  totalRowsProcessed: number;
  duplicateRowsEliminated: number;
  domainDetected: string;
  languageDetected: string;
}

export interface SchemaValidationReport {
  totalRows: number;
  validRows: number;
  quarantinedRows: number;
  schemaDetected: 'Official Hackathon Dataset' | 'Standard Enterprise Ingestion' | 'Custom CSV';
  normalizedCount: number;
  duplicateCount: number;
  detectedColumns: string[];
  quarantinedItems: Array<{
    rowNumber: number;
    rawContent: string;
    reason: string;
  }>;
}

export interface ActionablePlaybook {
  id: string;
  recommendationId: string;
  title: string;
  category: IssueCategory;
  severity: 'Critical' | 'High' | 'Medium';
  targetSLA: string;
  rootCauseClassification: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    instruction: string;
    ownerRole: string;
  }>;
  customerResponseTemplate: string;
  preventionMeasure: string;
}

export interface PredictiveEscalation {
  id: string;
  category: IssueCategory;
  title: string;
  volumeGrowthRate: number; // percentage
  sentimentTrajectory: 'accelerating_negative' | 'stable' | 'improving';
  predictedSlaBreachDays: number;
  alertLevel: 'urgent_spike' | 'warning' | 'normal';
  anomalyDescription: string;
  affectedAccountsCount: number;
  estimatedArrExposure: number;
}

export interface CustomerHealthScore {
  customerId: string;
  customerName: string;
  customerTier: CustomerTier;
  arrValue: number;
  healthScore: number; // 0 - 100
  status: 'healthy' | 'neutral' | 'at_risk' | 'critical';
  trajectory: 'improving' | 'stable' | 'declining';
  openIssuesCount: number;
  lastFeedbackDate: string;
  recommendedIntervention: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: IssueCategory;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priorityScore: number; // 0 - 100 calculated from impact x severity x arr
  affectedCustomersCount: number;
  totalArrAtRisk: number;
  rootCauseAnalysis: string;
  recommendedAction: string;
  evidenceQuotes: Array<{
    customerName: string;
    tier: CustomerTier;
    quote: string;
  }>;
  status: 'backlog' | 'in_progress' | 'resolved';
  assignee?: string;
  estimatedDaysToFix: number;
  expectedCSATLift: string;
  playbook?: ActionablePlaybook;
  frequencyMentions?: number;
  frequencyPercentage?: string;
  sentimentScore?: number;
  affectedCustomersPercent?: string;
  revenueImpactMonthly?: string;
  sampleFeedback?: string[];
  actionType?: 'Fix' | 'Plan' | 'Monitor' | 'Roadmap';
}

export type ActiveTab = 'overview' | 'feedbacks' | 'data-cleaning' | 'adaption-studio' | 'analytics' | 'recommendations' | 'tracker' | 'executive-report';
