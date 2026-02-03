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

export function BargainingFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const { supplierPower, buyerAlternatives, urgency } = state.frameworks.bargaining;

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
          framework: 'bargaining',
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
    completeFramework('bargaining');
    onComplete();
  };

  // Calculate bargaining position
  // High supplier power + low alternatives + high urgency = weak position
  const positionScore = ((6 - supplierPower) + buyerAlternatives + (6 - urgency)) / 3;
  const getPosition = () => {
    if (positionScore >= 4) {
      return { position: 'Strong', color: '#059669', recommendation: 'buy', text: 'Strong bargaining position — you can negotiate favorable terms in the market' };
    } else if (positionScore <= 2) {
      return { position: 'Weak', color: '#DC2626', recommendation: 'make', text: 'Weak bargaining position — consider reducing dependency through vertical integration' };
    } else {
      return { position: 'Moderate', color: '#D97706', recommendation: 'partner', text: 'Moderate position — partnerships can help balance power dynamics' };
    }
  };

  const positionInfo = getPosition();

  const getLevelLabel = (value: number) => {
    if (value === 1) return 'Very Low';
    if (value === 2) return 'Low';
    if (value === 3) return 'Moderate';
    if (value === 4) return 'High';
    return 'Very High';
  };

  return (
    <motion.div
      initial={ANIMATION.slideUp.initial}
      animate={ANIMATION.slideUp.animate}
      transition={ANIMATION.slideUp.transition}
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="text-sm text-muted-foreground mb-1">Framework 5 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Bargaining Power
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Analyze your negotiating position relative to potential partners and suppliers.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Supplier Power */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">1. Supplier Concentration</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(supplierPower)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How concentrated is the supplier market? Do a few players dominate?
            </p>
            <Slider
              value={[supplierPower]}
              onValueChange={(v) => updateFramework('bargaining', { supplierPower: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Supplier power level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Many suppliers available</span>
              <span>Few dominant suppliers</span>
            </div>
          </div>

          {/* Buyer Alternatives */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">2. Your Alternatives</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(buyerAlternatives)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How many viable alternatives do you have (other suppliers, in-house capability, substitutes)?
            </p>
            <Slider
              value={[buyerAlternatives]}
              onValueChange={(v) => updateFramework('bargaining', { buyerAlternatives: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Buyer alternatives level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>No real alternatives</span>
              <span>Many viable options</span>
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">3. Time Pressure</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(urgency)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How urgently do you need to secure this capability or component?
            </p>
            <Slider
              value={[urgency]}
              onValueChange={(v) => updateFramework('bargaining', { urgency: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Urgency level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Can wait / Flexible timeline</span>
              <span>Urgent / Immediate need</span>
            </div>
          </div>

          {/* Bargaining Position Visual */}
          <div className="bg-muted rounded-xl p-6">
            <h4 className="font-medium text-foreground mb-4 text-center">Your Bargaining Position</h4>

            {/* Balance scale visual */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: `${positionInfo.color}20` }}
                >
                  <span className="text-2xl">⚖️</span>
                </div>
                <span
                  className="font-bold text-lg"
                  style={{ color: positionInfo.color }}
                >
                  {positionInfo.position}
                </span>
              </div>
            </div>

            {/* Position factors summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 rounded ${supplierPower >= 4 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Supplier Power: {getLevelLabel(supplierPower).split(' ')[0]}
              </div>
              <div className={`p-2 rounded ${buyerAlternatives >= 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Your Options: {getLevelLabel(buyerAlternatives).split(' ')[0]}
              </div>
              <div className={`p-2 rounded ${urgency >= 4 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Time Pressure: {getLevelLabel(urgency).split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Insight box */}
          <div className="bg-amber-50 border-l-4 border-[#B4975A] rounded-r-lg p-4">
            <p className="text-sm text-[#78350F]">
              <strong>Insight:</strong> {positionInfo.text}
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
