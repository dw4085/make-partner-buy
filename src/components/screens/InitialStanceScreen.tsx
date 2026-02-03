'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Factory, ShoppingCart, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/Header';
import { useSession } from '@/context/SessionContext';
import { DECISIONS, CONTENT_LIMITS, ANIMATION } from '@/lib/constants';
import type { Decision } from '@/types';

const DECISION_ICONS = {
  make: Factory,
  buy: ShoppingCart,
  partner: Users,
};

export function InitialStanceScreen() {
  const { setStep, setInitialStance, state } = useSession();
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const characterCount = reasoning.length;
  const isValidReasoning = characterCount >= CONTENT_LIMITS.reasoning.min && characterCount <= CONTENT_LIMITS.reasoning.max;
  const canSubmit = selectedDecision && isValidReasoning && !isLocked;

  const handleSubmit = () => {
    if (!selectedDecision || !isValidReasoning) return;
    setIsLocked(true);
    setInitialStance(selectedDecision, reasoning, 3); // Default confidence of 3
    setStep('frameworks');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showStep currentStep={2} totalSteps={6} />

      <main id="main-content" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={ANIMATION.slideUp.initial}
            animate={ANIMATION.slideUp.animate}
            transition={ANIMATION.slideUp.transition}
          >
            {/* Scenario summary */}
            <Card className="shadow-md border-0 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {state.scenario?.title || 'Your Scenario'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {state.scenario?.summary || 'Loading...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main card */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-2xl text-foreground">
                  What&apos;s Your Initial Instinct?
                </CardTitle>
                <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
                <p className="text-muted-foreground mt-4">
                  Before we analyze the frameworks, capture your gut reaction.
                  This will be locked in so we can compare it later.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Decision options */}
                <div className="grid grid-cols-3 gap-4">
                  {(Object.keys(DECISIONS) as Decision[]).map((decision) => {
                    const config = DECISIONS[decision];
                    const Icon = DECISION_ICONS[decision];
                    const isSelected = selectedDecision === decision;

                    return (
                      <button
                        key={decision}
                        onClick={() => !isLocked && setSelectedDecision(decision)}
                        disabled={isLocked}
                        className={`
                          relative p-6 rounded-xl border-2 transition-all text-center
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-md'}
                          ${isSelected
                            ? 'border-transparent shadow-lg'
                            : 'border-border bg-white hover:border-gray-300'
                          }
                        `}
                        style={isSelected ? { backgroundColor: config.color } : undefined}
                        aria-pressed={isSelected}
                        aria-label={`${config.label} - ${config.description}`}
                      >
                        {/* Selection indicator */}
                        <div className={`
                          absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${isSelected ? 'border-white bg-white' : 'border-gray-300'}
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={config.color}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <div
                          className={`
                            w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
                            ${isSelected ? 'bg-white/20' : 'bg-muted'}
                          `}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: isSelected ? 'white' : '#6B7280' }}
                          />
                        </div>

                        <div
                          className="font-bold text-lg mb-1"
                          style={{ color: isSelected ? 'white' : '#1E3A5F' }}
                        >
                          {config.label.toUpperCase()}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#6B7280' }}
                        >
                          {config.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Reasoning input */}
                <div>
                  <label htmlFor="reasoning" className="block font-medium text-foreground mb-2">
                    Why do you think this is the right approach?
                  </label>
                  <Textarea
                    id="reasoning"
                    placeholder="Explain your initial reasoning in a few sentences..."
                    value={reasoning}
                    onChange={(e) => !isLocked && setReasoning(e.target.value)}
                    disabled={isLocked}
                    className="min-h-[120px] resize-none text-base"
                    aria-describedby="reasoning-count"
                  />
                  <div
                    id="reasoning-count"
                    className={`text-sm mt-2 flex justify-between ${
                      characterCount > 0 && !isValidReasoning
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span>
                      {characterCount < CONTENT_LIMITS.reasoning.min
                        ? `Minimum ${CONTENT_LIMITS.reasoning.min} characters`
                        : 'Good length'}
                    </span>
                    <span>{characterCount} / {CONTENT_LIMITS.reasoning.max}</span>
                  </div>
                </div>

                {/* Lock notice */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Your choice will be locked in after submission — this preserves the learning moment.
                  </span>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  Lock In My Choice
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
