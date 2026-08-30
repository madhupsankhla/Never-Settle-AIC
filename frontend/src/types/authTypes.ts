import type { PersonaType } from './index';

export interface UserAccount {
  id: string;
  name: string;
  initials: string;
  username: string;
  email: string;
  password: string;
  position: string;
  persona: PersonaType;
  scope: string;
  avatarBg: string;
  description: string;
  decisionRights: string;
}

export const PREDEFINED_USERS: UserAccount[] = [
  {
    id: 'usr-001',
    name: 'Rahul Sharma',
    initials: 'RS',
    username: 'rahul.sharma',
    email: 'rahul.sharma@solesight.ai',
    password: 'StoreOps@2026',
    position: 'Store Operations Manager',
    persona: 'store_manager',
    scope: 'STORE-001 • Puma Flagship Indiranagar',
    avatarBg: 'bg-emerald-600',
    description: 'Store footfall, shoe size fill-rates, try-on audits & floor runner allocation.',
    decisionRights: 'Floor staffing reassignments, shelf replenishment, local DC requests',
  },
  {
    id: 'usr-002',
    name: 'Priya Nair',
    initials: 'PN',
    username: 'priya.nair',
    email: 'priya.nair@solesight.ai',
    password: 'RetailOps@2026',
    position: 'Head of Retail & Sales Ops',
    persona: 'regional_ops',
    scope: 'West & South Regional Cluster (8 Stores)',
    avatarBg: 'bg-sky-600',
    description: 'Multi-store conversion benchmarking, cross-regional logistics & DC fulfillment lag.',
    decisionRights: 'Multi-store conversion benchmarking, inter-branch inventory reallocations',
  },
  {
    id: 'usr-003',
    name: 'Vikram Mehta',
    initials: 'VM',
    username: 'vikram.mehta',
    email: 'vikram.mehta@solesight.ai',
    password: 'GrowthCMO@2026',
    position: 'Chief Marketing & Growth Officer',
    persona: 'marketing_growth',
    scope: 'Brand Campaigns & Footfall Conversion',
    avatarBg: 'bg-purple-600',
    description: 'Campaign footfall traffic, customer trial conversion, ROAS & promotional elasticity.',
    decisionRights: 'Campaign media spend, promotion elasticity, customer trial funnel ROAS',
  },
  {
    id: 'usr-004',
    name: 'Ananya Verma',
    initials: 'AV',
    username: 'ananya.verma',
    email: 'ananya.verma@solesight.ai',
    password: 'CFOFinance@2026',
    position: 'Chief Financial Officer (CFO)',
    persona: 'cfo_finance',
    scope: 'Enterprise Network • All BUs & Footwear',
    avatarBg: 'bg-indigo-600',
    description: 'Top-line revenue loss, gross margins, EBITDA variance & emergency dispatch ROI.',
    decisionRights: 'EBITDA variance, capital expenditure ROI, revenue leakage mitigation',
  },
];

export const authenticateUser = (identifier: string, password: string): UserAccount | null => {
  const cleanId = identifier.trim().toLowerCase();
  const found = PREDEFINED_USERS.find(
    (u) =>
      (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
      u.password === password
  );
  return found || null;
};
