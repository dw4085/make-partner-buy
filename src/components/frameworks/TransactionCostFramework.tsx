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

export function TransactionCostFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();

  const { assetSpecificity, uncertainty, frequency } = state.frameworks.transactionCost;

  const handleComplete = () => {
    completeFramework('transactionCost');
    onComplete();
  };

  // Calculate TCE tendency
  const tceScore = (assetSpecificity + uncertainty + frequency) / 3;
  const getTendency = () => {
    if (tceScore >= 4) {
      return { recommendation: 'make', percentage: Math.round((tceScore / 5) * 100), text: 'High TCE factors favor hierarchy (make)' };
    } else if (tceScore <= 2) {
      return { recommendation: 'buy', percentage: Math.round((tceScore / 5) * 100), text: 'Low TCE factors favor markets (buy)' };
    } else {
      return { recommendation: 'partner', percentage: Math.round((tceScore / 5) * 100), text: 'Moderate TCE suggests hybrid arrangements (partner)' };
    }
  };

  const tendency = getTendency();

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
          <div className="text-sm text-muted-foreground mb-1">Framework 3 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Transaction Cost Economics
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Three factors determine whether transactions are best handled in-house or through markets.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Asset Specificity */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">1. Asset Specificity</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(assetSpecificity)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How customized must this technology be for your specific needs?
            </p>
            <Slider
              value={[assetSpecificity]}
              onValueChange={(v) => updateFramework('transactionCost', { assetSpecificity: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Asset specificity level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Generic / Off-the-shelf</span>
              <span>Highly customized</span>
            </div>
            <InputHint framework="transactionCost" inputId="assetSpecificity" />
          </div>

          {/* Uncertainty */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">2. Uncertainty</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(uncertainty)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How predictable is the future environment (regulatory, competitive, technological)?
            </p>
            <Slider
              value={[uncertainty]}
              onValueChange={(v) => updateFramework('transactionCost', { uncertainty: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Uncertainty level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Stable / Predictable</span>
              <span>Volatile / Unpredictable</span>
            </div>
            <InputHint framework="transactionCost" inputId="uncertainty" />
          </div>

          {/* Frequency */}
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-semibold text-foreground">3. Frequency</h4>
              <span className="text-sm text-muted-foreground">{getLevelLabel(frequency)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How often will you need to procure/produce this component?
            </p>
            <Slider
              value={[frequency]}
              onValueChange={(v) => updateFramework('transactionCost', { frequency: v[0] })}
              min={1}
              max={5}
              step={1}
              aria-label="Frequency level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rare / One-time</span>
              <span>Continuous / Daily</span>
            </div>
            <InputHint framework="transactionCost" inputId="frequency" />
          </div>

          {/* TCE Result Box */}
          <div className="bg-amber-50 border-l-4 border-[#B4975A] rounded-r-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📊</span>
              <span className="font-semibold text-[#92400E]">Your TCE Profile</span>
            </div>

            {/* Result bars */}
            <div className="space-y-3 mb-4">
              {[
                { label: 'Specificity', value: assetSpecificity },
                { label: 'Uncertainty', value: uncertainty },
                { label: 'Frequency', value: frequency },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-sm text-[#78350F] w-24">{item.label}</span>
                  <div className="flex-1 h-3 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #D97706, #B4975A)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 5) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#78350F] w-12">
                    {getLevelLabel(item.value).split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#B4975A]/30 flex items-center gap-3">
              <span className="text-sm font-medium text-[#78350F]">Tendency:</span>
              <span className="text-sm font-bold text-[#0D9488] bg-white px-4 py-1.5 rounded-lg">
                → {tendency.recommendation.toUpperCase()} ({tendency.percentage}%)
              </span>
            </div>
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
