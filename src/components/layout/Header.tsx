'use client';

import { useSession } from "@/context/SessionContext";

interface HeaderProps {
  showStep?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function Header({ showStep = false, currentStep, totalSteps }: HeaderProps) {
  const { resetSession, state } = useSession();

  const handleLogoClick = () => {
    if (state.step !== 'welcome') {
      if (window.confirm('Start a new analysis? Your current progress will be lost.')) {
        resetSession();
      }
    }
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1 -m-1"
            aria-label="Make Buy Partner - Go to home"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A5F 100%)' }}
            >
              <span className="text-white font-bold text-xs">MBP</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">
              Make · Buy · Partner
            </span>
          </button>

          {/* Step indicator */}
          {showStep && currentStep && totalSteps && (
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
