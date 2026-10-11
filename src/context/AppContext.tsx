import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  FeedbackItem, 
  RecommendationItem, 
  AdaptionRecipeSettings, 
  AdaptionBlueprint, 
  AdaptionQualityMetrics, 
  ActiveTab,
  SchemaValidationReport,
  ActionablePlaybook,
  PredictiveEscalation,
  CustomerHealthScore 
} from '../types';
import { 
  HACKATHON_OFFICIAL_DATASET, 
  HACKATHON_QUALITY_METRICS, 
  HACKATHON_RECOMMENDATIONS 
} from '../data/mockData';
import { AdaptionIntelligenceService } from '../services/adaptionService';
import confetti from 'canvas-confetti';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  feedbacks: FeedbackItem[];
  recommendations: RecommendationItem[];
  qualityMetrics: AdaptionQualityMetrics;
  recipes: AdaptionRecipeSettings;
  setRecipes: React.Dispatch<React.SetStateAction<AdaptionRecipeSettings>>;
  blueprint: AdaptionBlueprint;
  setBlueprint: React.Dispatch<React.SetStateAction<AdaptionBlueprint>>;
  isAdapting: boolean;
  adaptationProgress: number;
  adaptationStepText: string;
  hasRunAdaption: boolean;
  
  // Differentiators
  schemaReport: SchemaValidationReport | null;
  playbooks: ActionablePlaybook[];
  predictiveEscalations: PredictiveEscalation[];
  customerHealthScores: CustomerHealthScore[];
  activePlaybook: ActionablePlaybook | null;
  setActivePlaybook: (pb: ActionablePlaybook | null) => void;
  
  // Actions
  handleCSVUpload: (file: File) => Promise<void>;
  addManualFeedback: (item: Partial<FeedbackItem>) => void;
  runAdaptionPipeline: () => Promise<void>;
  updateIssueStatus: (id: string, status: 'backlog' | 'in_progress' | 'resolved') => void;
  loadPreset: (presetName: 'Build Battle 2026 (Official)' | 'CloudScale SaaS' | 'FinPay Banking') => void;
  triggerConfetti: () => void;
  downloadFineTuningData: () => void;
  downloadSampleTemplate: (format: 'hackathon' | 'enterprise') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(HACKATHON_OFFICIAL_DATASET);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() => {
    return HACKATHON_RECOMMENDATIONS.map(r => ({
      ...r,
      playbook: AdaptionIntelligenceService.generatePlaybookForRecommendation(r)
    }));
  });
  const [qualityMetrics, setQualityMetrics] = useState<AdaptionQualityMetrics>(HACKATHON_QUALITY_METRICS);
  const [schemaReport, setSchemaReport] = useState<SchemaValidationReport | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<ActionablePlaybook | null>(null);
  
  const [recipes, setRecipes] = useState<AdaptionRecipeSettings>({
    promptDeduplication: true,
    promptRephrasing: true,
    reasoningTraces: true,
    hallucinationMitigation: true,
    brandVoiceSteering: true,
    metadataInjection: true,
  });

  const [blueprint, setBlueprint] = useState<AdaptionBlueprint>({
    systemPrompt: 'Standardize customer disputes, detect fraud patterns, inject causal reasoning traces, and ensure strict factual grounding.',
    brandVoiceTone: 'Strict Technical',
    lengthConstraint: 'Detailed',
    safetyClassification: true,
    groundingThreshold: 98,
  });

  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [adaptationProgress, setAdaptationProgress] = useState<number>(0);
  const [adaptationStepText, setAdaptationStepText] = useState<string>('');
  const [hasRunAdaption, setHasRunAdaption] = useState<boolean>(true);

  // Derived high-impact features
  const playbooks = useMemo(() => {
    return recommendations
      .map(r => r.playbook || AdaptionIntelligenceService.generatePlaybookForRecommendation(r))
      .filter(Boolean);
  }, [recommendations]);

  const predictiveEscalations = useMemo(() => {
    return AdaptionIntelligenceService.generatePredictiveEscalations(feedbacks);
  }, [feedbacks]);

  const customerHealthScores = useMemo(() => {
    return AdaptionIntelligenceService.calculateCustomerHealthScores(feedbacks);
  }, [feedbacks]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#0f172a', '#3b82f6', '#10b981', '#f59e0b']
      });
    } catch {
      // fallback
    }
  };

  const handleCSVUpload = async (file: File) => {
    try {
      const { items, report } = await AdaptionIntelligenceService.parseCSVFileWithValidation(file);
      setFeedbacks(items);
      setSchemaReport(report);
      setHasRunAdaption(false);

      // Generate initial recommendations & playbooks
      const newRecs = AdaptionIntelligenceService.generateRecommendations(items);
      setRecommendations(newRecs);

      // Reset metrics to pre-adaptation baseline
      setQualityMetrics({
        ...qualityMetrics,
        baselineScore: 4.6,
        baselineGrade: 'C-',
        baselinePercentile: 32,
        adaptedScore: 0,
        adaptedGrade: 'Pending',
        adaptedPercentile: 0,
        qualityLiftPercentage: 0,
        totalRowsProcessed: items.length,
        duplicateRowsEliminated: report.duplicateCount,
      });
      triggerConfetti();
    } catch (err) {
      console.error('CSV Parsing failed', err);
      alert('Failed to parse CSV file. Please ensure it has valid headers.');
    }
  };

  const addManualFeedback = (item: Partial<FeedbackItem>) => {
    const newItem: FeedbackItem = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      customerName: item.customerName || 'Direct Customer',
      customerEmail: item.customerEmail || 'user@example.com',
      customerTier: item.customerTier || 'Enterprise',
      source: item.source || 'Customer Survey',
      rating: item.rating || 3,
      rawText: item.rawText || '',
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0,
      category: item.category || 'Fraud and Scam',
      urgency: item.urgency || 'medium',
      arrValue: item.arrValue || 45000,
      timestamp: new Date().toISOString(),
      adaptedPrompt: (item.rawText || '').slice(0, 80) + '...',
      adaptedContext: `Manual user submission - ${item.customerTier} tier`,
      adaptedCompletion: 'Pending batch adaptation run',
      isDeduplicated: false,
    };

    const updated = [newItem, ...feedbacks];
    setFeedbacks(updated);
    const newRecs = AdaptionIntelligenceService.generateRecommendations(updated);
    setRecommendations(newRecs);
  };

  const runAdaptionPipeline = async () => {
    setIsAdapting(true);
    setAdaptationProgress(10);
    setAdaptationStepText('Connecting to Adaption Labs Adaptive Data Engine...');

    try {
      const result = await AdaptionIntelligenceService.runAdaptiveDataPipeline(
        feedbacks,
        recipes,
        blueprint,
        (progress, text) => {
          setAdaptationProgress(progress);
          setAdaptationStepText(text);
        }
      );

      setFeedbacks(result.adaptedItems);
      setQualityMetrics(result.metrics);
      setHasRunAdaption(true);

      const refreshedRecs = AdaptionIntelligenceService.generateRecommendations(result.adaptedItems);
      setRecommendations(refreshedRecs);
      triggerConfetti();
    } finally {
      setIsAdapting(false);
    }
  };

  const updateIssueStatus = (id: string, status: 'backlog' | 'in_progress' | 'resolved') => {
    setRecommendations(prev => 
      prev.map(rec => {
        if (rec.id === id) {
          if (status === 'resolved' && rec.status !== 'resolved') {
            triggerConfetti();
          }
          return { ...rec, status };
        }
        return rec;
      })
    );
  };

  const loadPreset = (presetName: 'Build Battle 2026 (Official)' | 'CloudScale SaaS' | 'FinPay Banking') => {
    if (presetName === 'Build Battle 2026 (Official)') {
      setFeedbacks(HACKATHON_OFFICIAL_DATASET);
      setQualityMetrics(HACKATHON_QUALITY_METRICS);
      setRecommendations(HACKATHON_RECOMMENDATIONS);
      setHasRunAdaption(true);
    } else {
      setFeedbacks(HACKATHON_OFFICIAL_DATASET);
      setQualityMetrics(HACKATHON_QUALITY_METRICS);
      setRecommendations(HACKATHON_RECOMMENDATIONS);
      setHasRunAdaption(true);
    }
    triggerConfetti();
  };

  const downloadFineTuningData = () => {
    const jsonlContent = AdaptionIntelligenceService.exportFineTuningJSONL(feedbacks);
    const blob = new Blob([jsonlContent], { type: 'application/jsonl;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insightflow_adapted_sft_dataset_${Date.now()}.jsonl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerConfetti();
  };

  const downloadSampleTemplate = (format: 'hackathon' | 'enterprise') => {
    const csvContent = AdaptionIntelligenceService.generateSampleCSVTemplate(format);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insightflow_sample_template_${format}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        feedbacks,
        recommendations,
        qualityMetrics,
        recipes,
        setRecipes,
        blueprint,
        setBlueprint,
        isAdapting,
        adaptationProgress,
        adaptationStepText,
        hasRunAdaption,
        schemaReport,
        playbooks,
        predictiveEscalations,
        customerHealthScores,
        activePlaybook,
        setActivePlaybook,
        handleCSVUpload,
        addManualFeedback,
        runAdaptionPipeline,
        updateIssueStatus,
        loadPreset,
        triggerConfetti,
        downloadFineTuningData,
        downloadSampleTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
