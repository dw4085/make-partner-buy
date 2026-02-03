'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type {
  SessionState,
  AppStep,
  Scenario,
  InitialStance,
  FrameworkResults,
  FinalAnalysis,
  Decision,
} from '@/types';
import { MIN_FRAMEWORKS_REQUIRED } from '@/lib/constants';

// Initial framework state
const initialFrameworks: FrameworkResults = {
  competition: {
    performancePressure: 3,
    costPressure: 3,
    completed: false,
  },
  technology: {
    currentPhase: 'mature',
    emergingThreat: false,
    investmentLevel: 3,
    completed: false,
  },
  transactionCost: {
    assetSpecificity: 3,
    uncertainty: 3,
    frequency: 3,
    completed: false,
  },
  holdUpRisk: {
    switchingCosts: 3,
    relationshipSpecificity: 3,
    informationAsymmetry: 3,
    completed: false,
  },
  bargaining: {
    supplierPower: 3,
    buyerAlternatives: 3,
    urgency: 3,
    completed: false,
  },
  additional: {
    timeHorizon: 'medium',
    capabilityGap: 3,
    optionality: 3,
    completed: false,
  },
};

// Initial session state
const initialState: SessionState = {
  step: 'welcome',
  scenario: null,
  initialStance: null,
  frameworks: initialFrameworks,
  analysis: null,
  completedFrameworks: [],
};

// Action types
type SessionAction =
  | { type: 'SET_STEP'; payload: AppStep }
  | { type: 'SET_SCENARIO'; payload: Scenario }
  | { type: 'SET_INITIAL_STANCE'; payload: InitialStance }
  | { type: 'UPDATE_FRAMEWORK'; payload: { framework: keyof FrameworkResults; data: Partial<FrameworkResults[keyof FrameworkResults]> } }
  | { type: 'COMPLETE_FRAMEWORK'; payload: keyof FrameworkResults }
  | { type: 'SET_ANALYSIS'; payload: FinalAnalysis }
  | { type: 'RESET_SESSION' };

// Reducer
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload };

    case 'SET_INITIAL_STANCE':
      return { ...state, initialStance: action.payload };

    case 'UPDATE_FRAMEWORK': {
      const { framework, data } = action.payload;
      return {
        ...state,
        frameworks: {
          ...state.frameworks,
          [framework]: {
            ...state.frameworks[framework],
            ...data,
          },
        },
      };
    }

    case 'COMPLETE_FRAMEWORK': {
      const framework = action.payload;
      const completedFrameworks = state.completedFrameworks.includes(framework)
        ? state.completedFrameworks
        : [...state.completedFrameworks, framework];

      return {
        ...state,
        frameworks: {
          ...state.frameworks,
          [framework]: {
            ...state.frameworks[framework],
            completed: true,
          },
        },
        completedFrameworks,
      };
    }

    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload };

    case 'RESET_SESSION':
      return initialState;

    default:
      return state;
  }
}

// Context types
interface SessionContextType {
  state: SessionState;
  setStep: (step: AppStep) => void;
  setScenario: (scenario: Scenario) => void;
  setInitialStance: (decision: Decision, reasoning: string, confidence: number) => void;
  updateFramework: <K extends keyof FrameworkResults>(
    framework: K,
    data: Partial<FrameworkResults[K]>
  ) => void;
  completeFramework: (framework: keyof FrameworkResults) => void;
  setAnalysis: (analysis: FinalAnalysis) => void;
  resetSession: () => void;
  getCompletionPercentage: () => number;
  canProceedToResults: () => boolean;
}

// Create context
const SessionContext = createContext<SessionContextType | null>(null);

// Provider component
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const setStep = useCallback((step: AppStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setScenario = useCallback((scenario: Scenario) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenario });
  }, []);

  const setInitialStance = useCallback((decision: Decision, reasoning: string, confidence: number) => {
    dispatch({
      type: 'SET_INITIAL_STANCE',
      payload: { decision, reasoning, confidence, timestamp: new Date() },
    });
  }, []);

  const updateFramework = useCallback(<K extends keyof FrameworkResults>(
    framework: K,
    data: Partial<FrameworkResults[K]>
  ) => {
    dispatch({ type: 'UPDATE_FRAMEWORK', payload: { framework, data: data as Partial<FrameworkResults[keyof FrameworkResults]> } });
  }, []);

  const completeFramework = useCallback((framework: keyof FrameworkResults) => {
    dispatch({ type: 'COMPLETE_FRAMEWORK', payload: framework });
  }, []);

  const setAnalysis = useCallback((analysis: FinalAnalysis) => {
    dispatch({ type: 'SET_ANALYSIS', payload: analysis });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const getCompletionPercentage = useCallback(() => {
    const totalFrameworks = Object.keys(state.frameworks).length;
    const completed = state.completedFrameworks.length;
    return Math.round((completed / totalFrameworks) * 100);
  }, [state.frameworks, state.completedFrameworks]);

  const canProceedToResults = useCallback(() => {
    // Require at least MIN_FRAMEWORKS_REQUIRED frameworks to be completed
    return state.completedFrameworks.length >= MIN_FRAMEWORKS_REQUIRED;
  }, [state.completedFrameworks]);

  const value: SessionContextType = {
    state,
    setStep,
    setScenario,
    setInitialStance,
    updateFramework,
    completeFramework,
    setAnalysis,
    resetSession,
    getCompletionPercentage,
    canProceedToResults,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use the session context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
