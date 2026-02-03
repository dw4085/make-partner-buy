'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';
import { InputHint } from '@/components/ui/InputHint';
import { ANIMATION } from '@/lib/constants';

interface Props {
  onComplete: () => void;
}

type Phase = 'early' | 'mature' | 'plateau';

export function TechnologyFramework({ onComplete }: Props) {
  const { state, updateFramework, completeFramework } = useSession();

  const { currentPhase, emergingThreat } = state.frameworks.technology;

  const handlePhaseChange = (phase: Phase) => {
    updateFramework('technology', { currentPhase: phase });
  };

  const handleEmergingChange = (hasEmerging: boolean) => {
    updateFramework('technology', { emergingThreat: hasEmerging });
  };

  const handleComplete = () => {
    completeFramework('technology');
    onComplete();
  };

  const getInsight = () => {
    if (currentPhase === 'early') {
      return emergingThreat
        ? { text: 'Early-stage technology with emerging alternatives — high uncertainty favors flexibility through partnerships.' }
        : { text: 'Early-stage technology without clear alternatives — consider making if you can capture learning curve benefits.' };
    } else if (currentPhase === 'mature') {
      return emergingThreat
        ? { text: 'Mature technology facing disruption — be cautious about heavy investment in current technology.' }
        : { text: 'Mature, stable technology — buying may offer efficiency; making offers control.' };
    } else {
      return emergingThreat
        ? { text: 'Technology approaching limits with new alternatives emerging — prepare for transition, consider partnering for next-gen.' }
        : { text: 'Plateau without clear successor — optimize current approach while watching for disruption.' };
    }
  };

  const insight = getInsight();

  // Get phase position for curve marker
  const getPhasePosition = () => {
    switch (currentPhase) {
      case 'early': return 15;
      case 'mature': return 50;
      case 'plateau': return 85;
    }
  };

  return (
    <motion.div
      initial={ANIMATION.slideUp.initial}
      animate={ANIMATION.slideUp.animate}
      transition={ANIMATION.slideUp.transition}
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="text-sm text-muted-foreground mb-1">Framework 2 of 6</div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Technology S-Curve
          </CardTitle>
          <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
          <p className="text-muted-foreground mt-4">
            Technologies follow predictable lifecycles. Where is this technology in its S-curve?
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* S-Curve Visualization */}
          <div className="bg-muted rounded-xl p-6">
            <svg viewBox="0 0 400 200" className="w-full h-48">
              {/* Axes */}
              <line x1="40" y1="170" x2="380" y2="170" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="40" y1="170" x2="40" y2="20" stroke="#D1D5DB" strokeWidth="2" />

              {/* Axis labels */}
              <text x="210" y="195" textAnchor="middle" fill="#78716C" fontSize="12">Time / Investment</text>
              <text x="15" y="95" textAnchor="middle" fill="#78716C" fontSize="12" transform="rotate(-90, 15, 95)">Performance</text>

              {/* Physical limit line */}
              <line x1="40" y1="35" x2="380" y2="35" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="8,4" />
              <text x="340" y="28" fill="#78716C" fontSize="10">Physical Limit</text>

              {/* S-curve path */}
              <path
                d="M 50,160 Q 90,155 130,140 T 200,80 T 300,50 T 370,42"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Emerging tech curve (if applicable) */}
              {emergingThreat && (
                <path
                  d="M 180,165 Q 220,160 260,145 T 340,100"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  strokeLinecap="round"
                />
              )}

              {/* Current position marker */}
              <motion.circle
                cx={40 + (getPhasePosition() / 100) * 340}
                cy={currentPhase === 'early' ? 140 : currentPhase === 'mature' ? 70 : 45}
                r="10"
                fill="#1D4ED8"
                animate={{
                  cx: 40 + (getPhasePosition() / 100) * 340,
                  cy: currentPhase === 'early' ? 140 : currentPhase === 'mature' ? 70 : 45,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <motion.circle
                cx={40 + (getPhasePosition() / 100) * 340}
                cy={currentPhase === 'early' ? 140 : currentPhase === 'mature' ? 70 : 45}
                r="16"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="2"
                opacity="0.5"
                animate={{
                  cx: 40 + (getPhasePosition() / 100) * 340,
                  cy: currentPhase === 'early' ? 140 : currentPhase === 'mature' ? 70 : 45,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-[#1D4ED8] rounded" />
                <span className="text-muted-foreground">Current technology</span>
              </div>
              {emergingThreat && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-[#0D9488] rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #0D9488 0px, #0D9488 4px, transparent 4px, transparent 8px)' }} />
                  <span className="text-muted-foreground">Emerging alternative</span>
                </div>
              )}
            </div>
          </div>

          {/* Phase selection */}
          <div className="space-y-4">
            <label className="font-medium text-foreground">
              Where is the current technology in its lifecycle?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'early' as Phase, label: 'Early', subtitle: 'Rapid progress' },
                { value: 'mature' as Phase, label: 'Mature', subtitle: 'Scaling up' },
                { value: 'plateau' as Phase, label: 'Approaching Limit', subtitle: 'Plateau' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePhaseChange(option.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-center
                    ${currentPhase === option.value
                      ? 'border-primary bg-blue-50'
                      : 'border-border bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full border-2 mx-auto mb-2 flex items-center justify-center
                    ${currentPhase === option.value ? 'border-primary bg-primary' : 'border-gray-300'}
                  `}>
                    {currentPhase === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className={`font-medium ${currentPhase === option.value ? 'text-primary' : 'text-foreground'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{option.subtitle}</div>
                </button>
              ))}
            </div>
            <InputHint framework="technology" inputId="currentPhase" />
          </div>

          {/* Emerging threat toggle */}
          <div className="space-y-4">
            <label className="font-medium text-foreground">
              Is there an emerging alternative technology?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleEmergingChange(true)}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${emergingThreat
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-border bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className={`font-medium ${emergingThreat ? 'text-teal-700' : 'text-foreground'}`}>
                  Yes
                </div>
                <div className="text-xs text-muted-foreground">New tech emerging</div>
              </button>
              <button
                onClick={() => handleEmergingChange(false)}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${!emergingThreat
                    ? 'border-primary bg-blue-50'
                    : 'border-border bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className={`font-medium ${!emergingThreat ? 'text-primary' : 'text-foreground'}`}>
                  No
                </div>
                <div className="text-xs text-muted-foreground">No clear alternative</div>
              </button>
            </div>
            <InputHint framework="technology" inputId="emergingThreat" />
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
