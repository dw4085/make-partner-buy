'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSession } from '@/context/SessionContext';
import { ANIMATION } from '@/lib/constants';

interface Props {
  onComplete: () => void;
}

type TimeHorizon = 'short' | 'medium' | 'long';

export function AdditionalDimensionsFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const { timeHorizon, capabilityGap, optionality } = state.frameworks.additional;

  const getHint = async () => {
    if (hint) {
      setShowHint(!showHint);
      return;
    }

    setLoadingHint(true);
    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          framework: 'additional',
          scenario: state.scenario,
          inputs: state.frameworks,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHint(data.hint);
        setShowHint(true);
      }
    } catch (error) {
      console.error('Failed to get hint:', error);
    } finally {
      setLoadingHint(false);
    }
  };

  const handleComplete = () => {
    completeFramework('additional');
    onComplete();
  };

  const handleTimeHorizonChange = (horizon: TimeHorizon) => {
    updateFramework('additional', { timeHorizon: horizon });
  };

  const getLevelLabel = (value: number) => {
    if (value === 1) return 'Very Low';
    if (value === 2) return 'Low';
    if (value === 3) return 'Moderate';
    if (value === 4) return 'High';
    return 'Very High';
  };

  // Generate insight based on inputs
  const getInsight = () => {
    const insights: string[] = [];

    if (timeHorizon === 'short') {
      insights.push('Short time horizon favors buying or partnering for speed.');
    } else if (timeHorizon === 'long') {
      insights.push('Long time horizon makes building in-house more viable.');
    }

    if (capabilityGap >= 4) {
      insights.push('Large capability gap suggests partnering to access expertise.');
    } else if (capabilityGap <= 2) {
      insights.push('Small capability gap makes in-house development feasible.');
    }

    if (optionality >= 4) {
      insights.push('High optionality value favors flexible arrangements like partnerships.');
    } else if (optionality <= 2) {
      insights.push('Low need for optionality supports committed strategies.');
    }

    return insights.length > 0
      ? insights.join(' ')
      : 'Consider how these factors interact with your other framework analyses.';
  };

  return (
    <motion.div
      initial={ANIMATION.slideUp.initial}
      animate={ANIMATION.slideUp.animate}
      transition={ANIMATION.slideUp.transition}
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="text-sm text-muted-foreground mb-1">Framework 6 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Additional Dimensions
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Consider these additional strategic factors that may influence your decision.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Time Horizon */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <h4 className="font-semibold text-foreground">1. Time Horizon</h4>
            <p className="text-sm text-muted-foreground">
              What&apos;s your strategic planning timeframe for this decision?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'short' as TimeHorizon, label: 'Short-term', subtitle: '< 2 years' },
                { value: 'medium' as TimeHorizon, label: 'Medium-term', subtitle: '2-5 years' },
                { value: 'long' as TimeHorizon, label: 'Long-term', subtitle: '5+ years' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeHorizonChange(option.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-center
                    ${timeHorizon === option.value
                      ? 'border-primary bg-blue-50'
                      : 'border-border bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`font-medium ${timeHorizon === option.value ? 'text-primary' : 'text-foreground'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{option.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Capability Gap */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">2. Capability Gap</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(capabilityGap)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How large is the gap between your current capabilities and what&apos;s needed?
            </p>
            <Slider
              value={[capabilityGap]}
              onValueChange={(v) => updateFramework('additional', { capabilityGap: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Capability gap level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Already capable</span>
              <span>Major gap to close</span>
            </div>
          </div>

          {/* Strategic Optionality */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">3. Strategic Optionality</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(optionality)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How valuable is it to maintain flexibility and multiple options?
            </p>
            <Slider
              value={[optionality]}
              onValueChange={(v) => updateFramework('additional', { optionality: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Optionality value level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Commitment is fine</span>
              <span>Flexibility is crucial</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-xs text-[#1E3A5F] italic flex items-start gap-2">
                <span>💡</span>
                <span>Consider market uncertainty, technology changes, and strategic pivots you might need.</span>
              </p>
            </div>
          </div>

          {/* Summary visualization */}
          <div className="bg-muted rounded-xl p-6">
            <h4 className="font-medium text-foreground mb-4 text-center">Your Additional Factors</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">
                  {timeHorizon === 'short' ? '⏱️' : timeHorizon === 'medium' ? '📅' : '🗓️'}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {timeHorizon === 'short' ? 'Short' : timeHorizon === 'medium' ? 'Medium' : 'Long'}
                </div>
                <div className="text-xs text-muted-foreground">Time Horizon</div>
              </div>
              <div>
                <div className="text-3xl mb-2">
                  {capabilityGap <= 2 ? '✅' : capabilityGap <= 3 ? '🔧' : '🏗️'}
                </div>
                <div className="text-sm font-medium text-foreground">{getLevelLabel(capabilityGap)}</div>
                <div className="text-xs text-muted-foreground">Capability Gap</div>
              </div>
              <div>
                <div className="text-3xl mb-2">
                  {optionality <= 2 ? '🎯' : optionality <= 3 ? '🔀' : '🌊'}
                </div>
                <div className="text-sm font-medium text-foreground">{getLevelLabel(optionality)}</div>
                <div className="text-xs text-muted-foreground">Optionality Need</div>
              </div>
            </div>
          </div>

          {/* Insight box */}
          <div className="bg-amber-50 border-l-4 border-[#B4975A] rounded-r-lg p-4">
            <p className="text-sm text-[#78350F]">
              <strong>Insight:</strong> {getInsight()}
            </p>
          </div>

          {/* Hint toggle */}
          <Collapsible open={showHint} onOpenChange={setShowHint}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                onClick={getHint}
                disabled={loadingHint}
                className="text-primary hover:text-primary/80"
              >
                {loadingHint ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 rounded-lg p-4 mt-2"
                >
                  <p className="text-sm text-[#1E3A5F] whitespace-pre-line">{hint}</p>
                </motion.div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Complete button */}
          <Button onClick={handleComplete} className="w-full py-6" size="lg">
            Complete Framework
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
