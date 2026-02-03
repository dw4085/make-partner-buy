'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useSession } from '@/context/SessionContext';
import { InputHint } from '@/components/ui/InputHint';
import { ANIMATION } from '@/lib/constants';

interface Props {
  onComplete: () => void;
}

export function HoldUpRiskFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();

  const { switchingCosts, relationshipSpecificity, informationAsymmetry } = state.frameworks.holdUpRisk;

  const handleComplete = () => {
    completeFramework('holdUpRisk');
    onComplete();
  };

  // Calculate hold-up risk score
  const holdUpScore = (switchingCosts + relationshipSpecificity + informationAsymmetry) / 3;
  const getRiskLevel = () => {
    if (holdUpScore >= 4) {
      return { level: 'High', color: '#DC2626', recommendation: 'make', text: 'High hold-up risk — vertical integration protects against opportunism' };
    } else if (holdUpScore <= 2) {
      return { level: 'Low', color: '#059669', recommendation: 'buy', text: 'Low hold-up risk — market transactions are safe' };
    } else {
      return { level: 'Moderate', color: '#D97706', recommendation: 'partner', text: 'Moderate hold-up risk — structured partnerships with safeguards may work' };
    }
  };

  const riskInfo = getRiskLevel();

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
          <div className="text-sm text-muted-foreground mb-1">Framework 4 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Hold-Up Risk
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Assess the risk of being locked into unfavorable arrangements with partners or suppliers.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Switching Costs */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">1. Switching Costs</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(switchingCosts)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How costly would it be to switch to a different supplier or approach?
            </p>
            <Slider
              value={[switchingCosts]}
              onValueChange={(v) => updateFramework('holdUpRisk', { switchingCosts: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Switching costs level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy to switch</span>
              <span>Very difficult to switch</span>
            </div>
            <InputHint framework="holdUpRisk" inputId="switchingCosts" />
          </div>

          {/* Relationship Specificity */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">2. Relationship Specificity</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(relationshipSpecificity)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How much have you invested in this specific relationship (tooling, training, processes)?
            </p>
            <Slider
              value={[relationshipSpecificity]}
              onValueChange={(v) => updateFramework('holdUpRisk', { relationshipSpecificity: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Relationship specificity level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimal investment</span>
              <span>Deep, customized relationship</span>
            </div>
            <InputHint framework="holdUpRisk" inputId="relationshipSpecificity" />
          </div>

          {/* Information Asymmetry */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">3. Information Asymmetry</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(informationAsymmetry)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How much more does the supplier know about costs, quality, or technology than you do?
            </p>
            <Slider
              value={[informationAsymmetry]}
              onValueChange={(v) => updateFramework('holdUpRisk', { informationAsymmetry: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Information asymmetry level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Full transparency</span>
              <span>Significant knowledge gap</span>
            </div>
            <InputHint framework="holdUpRisk" inputId="informationAsymmetry" />
          </div>

          {/* Risk Assessment Result */}
          <div className="bg-muted rounded-xl p-6">
            <h4 className="font-medium text-foreground mb-4 text-center">Hold-Up Risk Assessment</h4>

            {/* Risk meter */}
            <div className="relative h-8 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full mb-4">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300"
                style={{ left: `calc(${(holdUpScore / 5) * 100}% - 12px)` }}
                animate={{ left: `calc(${(holdUpScore / 5) * 100}% - 12px)` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-4">
              <span>Low Risk</span>
              <span>Moderate</span>
              <span>High Risk</span>
            </div>

            <div
              className="text-center py-3 rounded-lg font-semibold"
              style={{ backgroundColor: `${riskInfo.color}15`, color: riskInfo.color }}
            >
              {riskInfo.level} Hold-Up Risk
            </div>
          </div>

          {/* Insight box */}
          <div className="bg-amber-50 border-l-4 border-[#B4975A] rounded-r-lg p-4">
            <p className="text-sm text-[#78350F]">
              <strong>Insight:</strong> {riskInfo.text}
            </p>
          </div>

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
