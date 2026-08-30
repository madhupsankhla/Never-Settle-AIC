import React, { useState, useEffect } from 'react';
import {
  fetchEvidence,
  fetchNarrative,
  fetchConstraints,
  saveConstraint,
  deleteConstraint,
  recordFeedback,
  fetchTelemetry,
} from './api/client';
import type {
  EvidenceObject,
  NarrativeResponse,
  PersonaType,
  KnownConstraint,
  TelemetrySummary,
} from './types';
import { SaaSDashboard } from './components/saas/SaaSDashboard';
import { FeedbackModal } from './components/FeedbackModal';
import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import type { UserAccount } from './types/authTypes';

const MainApplication: React.FC = () => {
  const { currentUser, isAuthenticated, quickLogin, logout } = useAuth();

  // Active persona tied to authenticated user (default: store_manager)
  const [currentPersona, setCurrentPersona] = useState<PersonaType>(
    () => currentUser?.persona || 'store_manager'
  );

  const [selectedStore] = useState<string>('STORE-001');
  const [selectedRegion] = useState<string>('West');
  const [selectedKpi] = useState<string>('conversion_rate');
  const [selectedScenario, setSelectedScenario] = useState<string>('hero');

  const [evidence, setEvidence] = useState<EvidenceObject | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [constraints, setConstraints] = useState<KnownConstraint[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [selectedDriverTag, setSelectedDriverTag] = useState<string | null>(null);

  // Sync persona when currentUser changes (e.g. on login or profile switch)
  useEffect(() => {
    if (currentUser?.persona) {
      setCurrentPersona(currentUser.persona);
    }
  }, [currentUser]);

  // Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    driver: string;
    verdict: 'upvote' | 'downvote';
  }>({ isOpen: false, driver: '', verdict: 'upvote' });

  // Initial Load: Constraints, Telemetry
  useEffect(() => {
    fetchConstraints()
      .then(setConstraints)
      .catch(() => setIsOffline(true));
    fetchTelemetry()
      .then(setTelemetry)
      .catch(() => setIsOffline(true));
  }, []);

  const runIntelligencePipeline = async () => {
    setIsLoading(true);

    try {
      const ev = await fetchEvidence({
        kpi: selectedKpi,
        store_id: selectedStore,
        period: '2026-W33',
        region: selectedRegion,
        scenario: selectedScenario,
        user_role: currentPersona,
        assigned_store: 'STORE-001',
      });
      setEvidence(ev);

      const nar = await fetchNarrative(ev, currentPersona);
      setNarrative(nar);
      setIsOffline(false);

      fetchTelemetry().then(setTelemetry).catch(() => {});
    } catch (err: any) {
      console.warn('Backend unavailable — running in offline pre-cached mode:', err.message);
      setIsOffline(true);
      setEvidence({
        evidence_id: 'EVD-OFFLINE-CACHE',
        kpi: selectedKpi,
        segment: { store_id: selectedStore, region: selectedRegion, network: 'SoleSight Retail Network' },
        period: '2026-W33',
        footfall_status: { change_pct: 3.9, is_material: false },
        change_pct: selectedScenario === 'normal' ? 0.6 : selectedScenario === 'abstention' ? -1.2 : -24.0,
        is_material: selectedScenario === 'hero',
        decomposition: [],
        hypotheses: [],
        data_freshness: { pos: '2026-08-17T09:00Z', inventory: '2026-08-15', mystery_shopper: '2026-08-01' },
        known_user_constraints_applied: [],
        abstain: selectedScenario === 'abstention',
        is_sparse_history: selectedScenario === 'sparse',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      runIntelligencePipeline();
    }
  }, [isAuthenticated, currentPersona, selectedStore, selectedRegion, selectedKpi, selectedScenario]);

  const handleSelectPersona = (p: PersonaType) => {
    setCurrentPersona(p);
    quickLogin(p);
  };

  const handleAddConstraint = async (c: KnownConstraint) => {
    try {
      await saveConstraint(c);
      const updated = await fetchConstraints();
      setConstraints(updated);
    } catch {
      setConstraints((prev) => [...prev, c]);
    }
    runIntelligencePipeline();
  };

  const handleDeleteConstraint = async (id: string) => {
    try {
      await deleteConstraint(id);
      const updated = await fetchConstraints();
      setConstraints(updated);
    } catch {
      setConstraints((prev) => prev.filter((c) => c.id !== id));
    }
    runIntelligencePipeline();
  };

  const handleSubmitFeedback = async (data: any) => {
    try {
      await recordFeedback(data);
      fetchTelemetry().then(setTelemetry).catch(() => {});
    } catch {
      // offline feedback logging
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user: UserAccount) => {
          quickLogin(user.persona);
        }}
      />
    );
  }

  return (
    <LocalizationProvider>
      <SaaSDashboard
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
        selectedScenario={selectedScenario}
        onSelectScenario={setSelectedScenario}
        evidence={evidence}
        narrative={narrative}
        constraints={constraints}
        telemetry={telemetry}
        isLoading={isLoading}
        isOffline={isOffline}
        onAddConstraint={handleAddConstraint}
        onDeleteConstraint={handleDeleteConstraint}
        onOpenFeedback={(driver, verdict) =>
          setFeedbackModal({ isOpen: true, driver, verdict })
        }
        onSelectEvidenceTag={(driver) => setSelectedDriverTag(driver)}
        selectedDriverTag={selectedDriverTag}
        onLogout={logout}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
        evidenceId={evidence?.evidence_id || 'EVD-0000'}
        driver={feedbackModal.driver}
        verdict={feedbackModal.verdict}
        userRole={currentPersona}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </LocalizationProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApplication />
    </AuthProvider>
  );
};

export default App;
