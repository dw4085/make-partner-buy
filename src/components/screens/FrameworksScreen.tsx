'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { useSession } from '@/context/SessionContext';
import { useHints } from '@/context/HintsContext';
import { FRAMEWORKS, ANIMATION, MIN_FRAMEWORKS_REQUIRED } from '@/lib/constants';

// Framework components
import { CompetitionFramework } from '@/components/frameworks/CompetitionFramework';
import { TechnologyFramework } from '@/components/frameworks/TechnologyFramework';
import { TransactionCostFramework } from '@/components/frameworks/TransactionCostFramework';
import { HoldUpRiskFramework } from '@/components/frameworks/HoldUpRiskFramework';
import { BargainingFramework } from '@/components/frameworks/BargainingFramework';
import { AdditionalDimensionsFramework } from '@/components/frameworks/AdditionalDimensionsFramework';

type FrameworkKey = keyof typeof FRAMEWORKS;

const FRAMEWORK_COMPONENTS: Record<FrameworkKey, React.ComponentType<{ onComplete: () => void }>> = {
  competition: CompetitionFramework,
  technology: TechnologyFramework,
  transactionCost: TransactionCostFramework,
  holdUpRisk: HoldUpRiskFramework,
  bargaining: BargainingFramework,
  additional: AdditionalDimensionsFramework,
};

export function FrameworksScreen() {
  const { state, canProceedToResults, setStep } = useSession();
  const { generateAllHints } = useHints();
  const [activeFramework, setActiveFramework] = useState<FrameworkKey | null>(null);

  // Pre-generate all input hints when entering the frameworks screen
  useEffect(() => {
    if (state.scenario) {
      generateAllHints(state.scenario);
    }
  }, [state.scenario, generateAllHints]);

  const handleFrameworkComplete = () => {
    setActiveFramework(null);
  };

  const handleProceedToResults = () => {
    setStep('results');
  };

  // If a framework is active, show its component
  if (activeFramework) {
    const FrameworkComponent = FRAMEWORK_COMPONENTS[activeFramework];
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showStep currentStep={3} totalSteps={6} />
        <ProgressBar label={FRAMEWORKS[activeFramework].shortTitle} />
        <main id="main-content" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setActiveFramework(null)}
              className="mb-4"
            >
              ← Back to Frameworks
            </Button>
            <FrameworkComponent onComplete={handleFrameworkComplete} />
          </div>
        </main>
      </div>
    );
  }

  // Framework selection grid
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showStep currentStep={3} totalSteps={6} />
      <ProgressBar />

      <main id="main-content" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={ANIMATION.slideUp.initial}
            animate={ANIMATION.slideUp.animate}
            transition={ANIMATION.slideUp.transition}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-foreground mb-2">
                Strategic Frameworks
              </h1>
              <div className="w-16 h-1 bg-[#B4975A] rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground max-w-lg mx-auto">
                Work through these frameworks in any order. Complete at least {MIN_FRAMEWORKS_REQUIRED} to see your results.
              </p>
            </div>

            {/* Framework grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <AnimatePresence mode="popLayout">
                {(Object.keys(FRAMEWORKS) as FrameworkKey[]).map((key, index) => {
                  const framework = FRAMEWORKS[key];
                  const isCompleted = state.completedFrameworks.includes(key);

                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`
                          cursor-pointer transition-all hover:shadow-lg border-2
                          ${isCompleted
                            ? 'border-green-500 bg-green-50'
                            : 'border-transparent hover:border-primary/30'
                          }
                        `}
                        onClick={() => setActiveFramework(key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setActiveFramework(key)}
                        aria-label={`${framework.title}${isCompleted ? ' - Completed' : ''}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{framework.icon}</span>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {framework.shortTitle}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {framework.description}
                                </p>
                              </div>
                            </div>
                            {isCompleted && (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Progress summary */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {state.completedFrameworks.length} of {Object.keys(FRAMEWORKS).length} frameworks completed
                {state.completedFrameworks.length < MIN_FRAMEWORKS_REQUIRED && (
                  <span className="block text-sm mt-1">
                    (Complete at least {MIN_FRAMEWORKS_REQUIRED} to see results)
                  </span>
                )}
              </p>

              <Button
                onClick={handleProceedToResults}
                disabled={!canProceedToResults()}
                size="lg"
                className="px-8"
              >
                See Your Results
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
