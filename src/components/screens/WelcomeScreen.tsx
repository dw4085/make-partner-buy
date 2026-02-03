'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';
import { ANIMATION } from '@/lib/constants';

export function WelcomeScreen() {
  const { setStep } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with gradient background */}
      <div
        className="flex-1 flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A5F 100%)' }}
      >
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={ANIMATION.fadeIn.initial}
          animate={ANIMATION.fadeIn.animate}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ backgroundColor: '#B4975A' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="text-white font-bold text-2xl">MBP</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-serif text-4xl sm:text-5xl text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Make · Buy · Partner
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-white/80 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Strategic Decision Analysis Tool
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => setStep('scenario-input')}
              className="bg-white text-[#1D4ED8] hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Begin Your Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Info section */}
      <div className="bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* How it works */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#1D4ED8]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1. Describe Your Scenario</h3>
                <p className="text-sm text-muted-foreground">
                  Input a business scenario or use the Rivian case study example
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-[#B4975A]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">2. Apply Frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  Work through strategic frameworks to analyze your decision
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-[#0D9488]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">3. Reflect & Learn</h3>
                <p className="text-sm text-muted-foreground">
                  Compare your instinct with systematic analysis
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hint box */}
          <motion.div
            className="bg-blue-50 rounded-xl p-6 border-l-4 border-[#1D4ED8]"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <p className="text-[#1E3A5F] italic">
              <span className="font-semibold not-italic">Tip:</span> This tool is designed to help you
              develop strategic intuition. There are no "wrong" answers — the goal is to compare your
              initial instincts with what emerges from systematic analysis.
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8 pt-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Columbia Business School</span>
              {' · '}Technology Strategy{' · '}Prof. Dan Wang
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
