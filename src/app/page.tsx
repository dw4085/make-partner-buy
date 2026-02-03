'use client';

import { useSession } from '@/context/SessionContext';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { ScenarioInputScreen } from '@/components/screens/ScenarioInputScreen';
import { InitialStanceScreen } from '@/components/screens/InitialStanceScreen';
import { FrameworksScreen } from '@/components/screens/FrameworksScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';
import { ReflectionScreen } from '@/components/screens/ReflectionScreen';

export default function Home() {
  const { state } = useSession();

  switch (state.step) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'scenario-input':
      return <ScenarioInputScreen />;
    case 'initial-stance':
      return <InitialStanceScreen />;
    case 'frameworks':
      return <FrameworksScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'reflection':
      return <ReflectionScreen />;
    default:
      return <WelcomeScreen />;
  }
}
