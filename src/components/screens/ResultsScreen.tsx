'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useSession } from '@/context/SessionContext';
import { DECISIONS, ANIMATION } from '@/lib/constants';
import type { Decision } from '@/types';

export function ResultsScreen() {
  const { state, setStep, setAnalysis } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (state.analysis) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario: state.scenario,
            stance: state.initialStance,
            frameworks: state.frameworks,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze results');
        }

        const analysis = await response.json();
        setAnalysis(analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [state.scenario, state.initialStance, state.frameworks, state.analysis, setAnalysis]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showStep currentStep={5} totalSteps={6} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing your frameworks...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showStep currentStep={5} totalSteps={6} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-destructive font-medium mb-2">Analysis Error</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const analysis = state.analysis!;
  const initialDecision = state.initialStance?.decision as Decision;
  const finalDecision = analysis.primaryRecommendation as Decision;
  const decisionsMatch = initialDecision === finalDecision;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showStep currentStep={5} totalSteps={6} />

      {/* Progress complete indicator */}
      <div className="bg-white border-b border-border py-3 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: '100%', background: 'linear-gradient(90deg, #1D4ED8, #B4975A)' }}
            />
          </div>
          <span className="text-sm text-green-600 font-semibold">✓ Complete!</span>
        </div>
      </div>

      <main id="main-content" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={ANIMATION.slideUp.initial}
            animate={ANIMATION.slideUp.animate}
            transition={ANIMATION.slideUp.transition}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-2xl text-foreground">
                  Your Analysis is Complete
                </CardTitle>
                <div className="w-20 h-1 bg-[#B4975A] rounded-full mt-2" />
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Comparison Cards */}
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div
                    className="text-center p-6 rounded-2xl min-w-[160px]"
                    style={{ backgroundColor: '#FEF3C7', border: '2px solid #D97706' }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-3">
                      Your Initial Instinct
                    </p>
                    <p className="text-2xl font-bold" style={{ color: DECISIONS[initialDecision].color }}>
                      {DECISIONS[initialDecision].label.toUpperCase()}
                    </p>
                    <p className="text-sm text-amber-700 mt-1">{DECISIONS[initialDecision].subtitle}</p>
                  </div>

                  <span className="text-3xl text-gray-300">→</span>

                  <div
                    className="text-center p-6 rounded-2xl min-w-[160px]"
                    style={{ backgroundColor: '#CCFBF1', border: '2px solid #0D9488' }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-800 mb-3">
                      Systematic Analysis
                    </p>
                    <p className="text-2xl font-bold" style={{ color: DECISIONS[finalDecision].color }}>
                      {DECISIONS[finalDecision].label.toUpperCase()}
                    </p>
                    <p className="text-sm text-teal-700 mt-1">{DECISIONS[finalDecision].subtitle}</p>
                  </div>
                </div>

                {/* Match/Difference indicator */}
                {decisionsMatch ? (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">
                      ✓ Your instinct aligned with the systematic analysis!
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">
                      The frameworks suggest a different approach — let&apos;s explore why.
                    </span>
                  </div>
                )}

                {/* Framework Breakdown */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Framework Breakdown</h3>
                  <div className="space-y-3">
                    {analysis.frameworkResults.map((result) => (
                      <div key={result.framework} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-32 flex-shrink-0">
                          {result.framework}
                        </span>
                        <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                          {result.recommendation !== 'inconclusive' ? (
                            <motion.div
                              className="h-full rounded-md flex items-center px-3"
                              style={{
                                backgroundColor: DECISIONS[result.recommendation].color,
                                width: `${result.confidence}%`,
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <span className="text-xs font-semibold text-white">
                                → {result.recommendation.toUpperCase()}
                              </span>
                            </motion.div>
                          ) : (
                            <div
                              className="h-full rounded-md flex items-center px-3 bg-gray-300"
                              style={{ width: '50%' }}
                            >
                              <span className="text-xs font-semibold text-gray-600">Inconclusive</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-foreground w-12 text-right">
                          {result.recommendation !== 'inconclusive' ? `${result.confidence}%` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weighted Recommendation */}
                <div className="bg-muted rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    Weighted Recommendation
                  </h3>
                  <div className="space-y-4">
                    {(Object.keys(DECISIONS) as Decision[]).map((decision) => {
                      const value = analysis.weightedResult[decision];
                      return (
                        <div key={decision}>
                          <div className="flex justify-between mb-1">
                            <span
                              className="font-semibold"
                              style={{ color: DECISIONS[decision].color }}
                            >
                              {DECISIONS[decision].label.toUpperCase()}
                            </span>
                            <span className="font-bold text-foreground">{value}%</span>
                          </div>
                          <div className="h-3 bg-border rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: DECISIONS[decision].color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {analysis.conflictingFrameworks && (
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      Note: The frameworks are relatively split — this is genuinely a judgment call.
                      Consider which factors matter most in your specific context.
                    </p>
                  )}
                </div>

                {/* Continue button */}
                <Button
                  onClick={() => setStep('reflection')}
                  className="w-full py-6"
                  size="lg"
                >
                  See Reflection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
