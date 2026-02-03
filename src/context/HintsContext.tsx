'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { HintsState, FrameworkId, FrameworkHints, InputHintsResponse, Scenario } from '@/types';
import { getFrameworkInputIds } from '@/lib/inputMetadata';

const FRAMEWORKS: FrameworkId[] = [
  'competition',
  'technology',
  'transactionCost',
  'holdUpRisk',
  'bargaining',
  'additional'
];

// Create initial state for a framework's hints
function createInitialFrameworkHints(frameworkId: string): FrameworkHints {
  const inputIds = getFrameworkInputIds(frameworkId);
  return inputIds.reduce((acc, inputId) => ({
    ...acc,
    [inputId]: { hint: null, loading: false, error: null }
  }), {});
}

const initialState: HintsState = {
  competition: createInitialFrameworkHints('competition'),
  technology: createInitialFrameworkHints('technology'),
  transactionCost: createInitialFrameworkHints('transactionCost'),
  holdUpRisk: createInitialFrameworkHints('holdUpRisk'),
  bargaining: createInitialFrameworkHints('bargaining'),
  additional: createInitialFrameworkHints('additional'),
  generationTriggered: false,
};

type HintsAction =
  | { type: 'SET_FRAMEWORK_LOADING'; payload: { framework: FrameworkId } }
  | { type: 'SET_FRAMEWORK_HINTS'; payload: { framework: FrameworkId; hints: Record<string, string> } }
  | { type: 'SET_FRAMEWORK_ERROR'; payload: { framework: FrameworkId; error: string } }
  | { type: 'SET_GENERATION_TRIGGERED' }
  | { type: 'RESET_HINTS' };

function hintsReducer(state: HintsState, action: HintsAction): HintsState {
  switch (action.type) {
    case 'SET_FRAMEWORK_LOADING': {
      const { framework } = action.payload;
      const inputIds = getFrameworkInputIds(framework);
      const updatedHints = inputIds.reduce((acc, inputId) => ({
        ...acc,
        [inputId]: { hint: null, loading: true, error: null }
      }), {} as FrameworkHints);
      return { ...state, [framework]: updatedHints };
    }

    case 'SET_FRAMEWORK_HINTS': {
      const { framework, hints } = action.payload;
      const updatedHints = Object.entries(hints).reduce((acc, [inputId, hint]) => ({
        ...acc,
        [inputId]: { hint, loading: false, error: null }
      }), {} as FrameworkHints);
      return { ...state, [framework]: { ...state[framework], ...updatedHints } };
    }

    case 'SET_FRAMEWORK_ERROR': {
      const { framework, error } = action.payload;
      const inputIds = getFrameworkInputIds(framework);
      const updatedHints = inputIds.reduce((acc, inputId) => ({
        ...acc,
        [inputId]: { hint: null, loading: false, error }
      }), {} as FrameworkHints);
      return { ...state, [framework]: updatedHints };
    }

    case 'SET_GENERATION_TRIGGERED':
      return { ...state, generationTriggered: true };

    case 'RESET_HINTS':
      return initialState;

    default:
      return state;
  }
}

interface HintsContextType {
  hints: HintsState;
  getInputHint: (framework: FrameworkId, inputId: string) => { hint: string | null; loading: boolean; error: string | null };
  generateAllHints: (scenario: Scenario) => Promise<void>;
  resetHints: () => void;
  isGenerating: boolean;
}

const HintsContext = createContext<HintsContextType | null>(null);

export function HintsProvider({ children }: { children: ReactNode }) {
  const [hints, dispatch] = useReducer(hintsReducer, initialState);

  const getInputHint = useCallback((framework: FrameworkId, inputId: string) => {
    return hints[framework]?.[inputId] || { hint: null, loading: false, error: null };
  }, [hints]);

  const generateAllHints = useCallback(async (scenario: Scenario) => {
    if (hints.generationTriggered) return;

    dispatch({ type: 'SET_GENERATION_TRIGGERED' });

    // Set all frameworks to loading
    FRAMEWORKS.forEach(framework => {
      dispatch({ type: 'SET_FRAMEWORK_LOADING', payload: { framework } });
    });

    // Fetch all frameworks in parallel
    await Promise.all(
      FRAMEWORKS.map(async (framework) => {
        try {
          const response = await fetch('/api/input-hints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ framework, scenario }),
          });

          if (response.ok) {
            const data: InputHintsResponse = await response.json();
            dispatch({ type: 'SET_FRAMEWORK_HINTS', payload: { framework, hints: data.hints } });
          } else {
            dispatch({ type: 'SET_FRAMEWORK_ERROR', payload: { framework, error: 'Failed to generate hints' } });
          }
        } catch (error) {
          console.error(`Error generating hints for ${framework}:`, error);
          dispatch({ type: 'SET_FRAMEWORK_ERROR', payload: { framework, error: 'Network error' } });
        }
      })
    );
  }, [hints.generationTriggered]);

  const resetHints = useCallback(() => {
    dispatch({ type: 'RESET_HINTS' });
  }, []);

  // Calculate if any framework is still loading
  const isGenerating = FRAMEWORKS.some(
    framework => Object.values(hints[framework]).some(input => input?.loading)
  );

  return (
    <HintsContext.Provider value={{ hints, getInputHint, generateAllHints, resetHints, isGenerating }}>
      {children}
    </HintsContext.Provider>
  );
}

export function useHints() {
  const context = useContext(HintsContext);
  if (!context) {
    throw new Error('useHints must be used within a HintsProvider');
  }
  return context;
}
