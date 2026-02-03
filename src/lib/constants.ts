// Design System Constants
// Columbia Executive + Warm Educational Style

export const COLORS = {
  // Primary palette
  primary: {
    columbia: '#1D4ED8',      // Columbia Blue
    navy: '#1E3A5F',          // Warm Navy
    gold: '#B4975A',          // Gold Accent
  },
  // Decision colors (colorblind-safe)
  decision: {
    make: '#0D9488',          // Teal
    buy: '#2563EB',           // Blue
    partner: '#C2410C',       // Orange-brown (adjusted for colorblind)
  },
  // Semantic colors
  semantic: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0EA5E9',
  },
  // Background
  background: {
    warm: '#FFFBF5',          // Warm cream
    card: '#FFFFFF',
    muted: '#F9FAFB',
  },
  // Text
  text: {
    primary: '#1E3A5F',
    secondary: '#4B5563',
    muted: '#78716C',
  },
  // Borders
  border: {
    default: '#E5E7EB',
    hover: '#D1D5DB',
  },
} as const;

// Framework metadata
export const FRAMEWORKS = {
  competition: {
    id: 'competition',
    title: 'Competition-Driven Pressures',
    shortTitle: 'Competition',
    description: 'Analyze how performance demands and cost pressures affect your decision.',
    icon: '⚔️',
    order: 1,
  },
  technology: {
    id: 'technology',
    title: 'Technology S-Curve',
    shortTitle: 'Technology',
    description: 'Consider where the technology sits in its lifecycle.',
    icon: '📈',
    order: 2,
  },
  transactionCost: {
    id: 'transactionCost',
    title: 'Transaction Cost Economics',
    shortTitle: 'Transaction Costs',
    description: 'Evaluate specificity, uncertainty, and frequency.',
    icon: '🎚️',
    order: 3,
  },
  holdUpRisk: {
    id: 'holdUpRisk',
    title: 'Hold-Up Risk',
    shortTitle: 'Hold-Up Risk',
    description: 'Assess the risk of being locked into unfavorable arrangements.',
    icon: '🔒',
    order: 4,
  },
  bargaining: {
    id: 'bargaining',
    title: 'Bargaining Power',
    shortTitle: 'Bargaining',
    description: 'Analyze your negotiating position relative to potential partners.',
    icon: '⚖️',
    order: 5,
  },
  additional: {
    id: 'additional',
    title: 'Additional Dimensions',
    shortTitle: 'Additional',
    description: 'Consider time horizon, capability gaps, and optionality.',
    icon: '🔮',
    order: 6,
  },
} as const;

// Decision labels and descriptions
export const DECISIONS = {
  make: {
    label: 'Make',
    subtitle: 'In-House',
    description: 'Develop and produce internally',
    color: COLORS.decision.make,
  },
  buy: {
    label: 'Buy',
    subtitle: 'Outsource',
    description: 'Purchase from external vendors',
    color: COLORS.decision.buy,
  },
  partner: {
    label: 'Partner',
    subtitle: 'Joint Venture',
    description: 'Collaborate with strategic partners',
    color: COLORS.decision.partner,
  },
} as const;

// Content constraints
export const CONTENT_LIMITS = {
  scenario: {
    min: 100,
    max: 5000,
  },
  reasoning: {
    min: 25,
    max: 500,
  },
} as const;

// Minimum frameworks required to see results
export const MIN_FRAMEWORKS_REQUIRED = 4;

// Animation variants for Framer Motion
export const ANIMATION = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
} as const;
