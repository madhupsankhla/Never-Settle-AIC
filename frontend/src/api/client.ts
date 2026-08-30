import type {
  EvidenceObject,
  NarrativeResponse,
  PersonaType,
  KnownConstraint,
  TelemetrySummary,
  OrgHierarchy,
} from '../types';

const API_BASE = '/api/v1';

export async function fetchEvidence(params: {
  kpi?: string;
  store_id?: string;
  period?: string;
  region?: string;
  scenario?: string;
  user_role?: string;
  assigned_store?: string;
}): Promise<EvidenceObject> {
  const query = new URLSearchParams();
  if (params.kpi) query.set('kpi', params.kpi);
  if (params.store_id) query.set('store_id', params.store_id);
  if (params.period) query.set('period', params.period);
  if (params.region) query.set('region', params.region);
  if (params.scenario) query.set('scenario', params.scenario);
  if (params.user_role) query.set('user_role', params.user_role);
  if (params.assigned_store) query.set('assigned_store', params.assigned_store);

  const res = await fetch(`${API_BASE}/evidence?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Error ${res.status}: Failed to fetch evidence`);
  }
  return res.json();
}

export async function fetchNarrative(
  evidence: EvidenceObject,
  persona: PersonaType
): Promise<NarrativeResponse> {
  const res = await fetch(`${API_BASE}/narrative`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidence, persona }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to generate narrative');
  }
  return res.json();
}

export async function fetchOrgTree(): Promise<OrgHierarchy> {
  const res = await fetch(`${API_BASE}/kpis/org-tree`);
  if (!res.ok) throw new Error('Failed to fetch org tree');
  return res.json();
}

export async function fetchKPIs(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/kpis`);
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function fetchConstraints(): Promise<KnownConstraint[]> {
  const res = await fetch(`${API_BASE}/constraints`);
  if (!res.ok) throw new Error('Failed to fetch constraints');
  return res.json();
}

export async function saveConstraint(constraint: KnownConstraint): Promise<any> {
  const res = await fetch(`${API_BASE}/constraints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(constraint),
  });
  if (!res.ok) throw new Error('Failed to save constraint');
  return res.json();
}

export async function deleteConstraint(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/constraints/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete constraint');
  return res.json();
}

export async function recordFeedback(feedback: {
  evidence_id: string;
  hypothesis_driver: string;
  verdict: 'upvote' | 'downvote';
  correction_text?: string;
  user_role: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function fetchTelemetry(): Promise<TelemetrySummary> {
  const res = await fetch(`${API_BASE}/telemetry`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return res.json();
}
