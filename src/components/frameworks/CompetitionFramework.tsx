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

export function CompetitionFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();

  const { performancePressure, costPressure } = state.frameworks.competition;

  const handlePerformanceChange = (value: number[]) => {
    updateFramework('competition', { performancePressure: value[0] });
  };

  const handleCostChange = (value: number[]) => {
    updateFramework('competition', { costPressure: value[0] });
  };

  const handleComplete = () => {
    completeFramework('competition');
    onComplete();
  };

  // Determine matrix quadrant based on inputs
  const getQuadrantInsight = () => {
    const highPerformance = performancePressure >= 4;
    const highCost = costPressure >= 4;

    if (highPerformance && !highCost) {
      return { recommendation: 'make', text: 'High performance pressure with manageable costs suggests building in-house for differentiation.' };
    } else if (!highPerformance && highCost) {
      return { recommendation: 'buy', text: 'Cost pressure dominates — consider outsourcing to specialized, efficient suppliers.' };
    } else if (highPerformance && highCost) {
      return { recommendation: 'partner', text: 'Both pressures are high — a partnership may balance innovation needs with cost efficiency.' };
    } else {
      return { recommendation: 'inconclusive', text: 'Low pressures on both dimensions — the decision depends more on other factors.' };
    }
  };

  const insight = getQuadrantInsight();

  return (
    <motion.div
      initial={ANIMATION.slideUp.initial}
      animate={ANIMATION.slideUp.animate}
      transition={ANIMATION.slideUp.transition}
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="text-sm text-muted-foreground mb-1">Framework 1 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Competition-Driven Pressures
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Consider how competitive dynamics affect your make-buy-partner decision.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Performance Pressure Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="font-medium text-foreground">
                Performance Pressure
              </label>
              <span className="text-sm text-muted-foreground">
                {performancePressure === 1 && 'Very Low'}
                {performancePressure === 2 && 'Low'}
                {performancePressure === 3 && 'Moderate'}
                {performancePressure === 4 && 'High'}
                {performancePressure === 5 && 'Very High'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              How much does the market demand continuous performance improvements?
            </p>
            <Slider
              value={[performancePressure]}
              onValueChange={handlePerformanceChange}
              min={1}
              max={5}
              step={1}
              className="mt-2"
              aria-label="Performance pressure level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Commodity market</span>
              <span>Rapid innovation required</span>
            </div>
            <InputHint framework="competition" inputId="performancePressure" />
          </div>

          {/* Cost Pressure Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="font-medium text-foreground">
                Cost Reduction Pressure
              </label>
              <span className="text-sm text-muted-foreground">
                {costPressure === 1 && 'Very Low'}
                {costPressure === 2 && 'Low'}
                {costPressure === 3 && 'Moderate'}
                {costPressure === 4 && 'High'}
                {costPressure === 5 && 'Very High'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              How intense is the pressure to reduce costs in this component/capability?
            </p>
            <Slider
              value={[costPressure]}
              onValueChange={handleCostChange}
              min={1}
              max={5}
              step={1}
              className="mt-2"
              aria-label="Cost pressure level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Premium tolerated</span>
              <span>Aggressive cost competition</span>
            </div>
            <InputHint framework="competition" inputId="costPressure" />
          </div>

          {/* 2x2 Matrix Visualization */}
          <div className="bg-muted rounded-xl p-6">
            <h4 className="font-medium text-foreground mb-4 text-center">Your Position</h4>
            <div className="relative aspect-square max-w-xs mx-auto border-2 border-border rounded-lg bg-white">
              {/* Quadrant labels */}
              <div className="absolute top-2 left-2 text-xs text-muted-foreground">Low Cost</div>
              <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">High Cost</div>
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">High Perf.</div>

              {/* Grid lines */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border" />
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-border" />

              {/* Position marker */}
              <motion.div
                className="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                style={{
                  left: `${((performancePressure - 1) / 4) * 80 + 10}%`,
                  bottom: `${((costPressure - 1) / 4) * 80 + 10}%`,
                  transform: 'translate(-50%, 50%)',
                }}
                animate={{
                  left: `${((performancePressure - 1) / 4) * 80 + 10}%`,
                  bottom: `${((costPressure - 1) / 4) * 80 + 10}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                YOU
              </motion.div>
            </div>
          </div>

          {/* Insight box */}
          <div className="bg-amber-50 border-l-4 border-[#B4975A] rounded-r-lg p-4">
            <p className="text-sm text-[#78350F]">
              <strong>Insight:</strong> {insight.text}
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
