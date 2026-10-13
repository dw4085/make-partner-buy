'use client';

import { useEffect } from 'react';
import { startHub } from '@/lib/hubEvents';

// Connects the page to the class hub's activity log and sends any reports still held in this
// browser from an earlier visit.
export function HubInit() {
  useEffect(() => {
    startHub();
  }, []);
  return null;
}
