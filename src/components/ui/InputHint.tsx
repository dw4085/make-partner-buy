'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useHints } from '@/context/HintsContext';
import type { FrameworkId } from '@/types';

interface Props {
  framework: FrameworkId;
  inputId: string;
  className?: string;
}

export function InputHint({ framework, inputId, className = '' }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getInputHint } = useHints();

  const { hint, loading, error } = getInputHint(framework, inputId);

  // Don't render anything if there's an error
  if (error) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={loading || !hint}
        className={`
          flex items-center gap-1.5 text-sm transition-colors
          ${loading ? 'text-muted-foreground cursor-wait' : 'text-primary hover:text-primary/80 cursor-pointer'}
          ${!hint && !loading ? 'opacity-50' : ''}
        `}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Hide' : 'Show'} hint for ${inputId}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Lightbulb className="h-3.5 w-3.5" />
        )}
        <span>{loading ? 'Loading hint...' : 'Get a hint'}</span>
        {hint && !loading && (
          isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 rounded-lg p-3 mt-2 border-l-4 border-blue-400">
              <p className="text-sm text-[#1E3A5F] whitespace-pre-line leading-relaxed">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
