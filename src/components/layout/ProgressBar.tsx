'use client';

import { useSession } from "@/context/SessionContext";
import { Progress } from "@/components/ui/progress";
import { FRAMEWORKS } from "@/lib/constants";

interface ProgressBarProps {
  label?: string;
}

export function ProgressBar({ label }: ProgressBarProps) {
  const { getCompletionPercentage, state } = useSession();
  const percentage = getCompletionPercentage();
  const completedCount = state.completedFrameworks.length;
  const totalCount = Object.keys(FRAMEWORKS).length;

  return (
    <div className="bg-white border-b border-border py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress
              value={percentage}
              className="h-2"
              aria-label={`Progress: ${completedCount} of ${totalCount} frameworks completed`}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {label || `${completedCount}/${totalCount} frameworks`}
          </span>
        </div>
      </div>
    </div>
  );
}
