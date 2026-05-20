/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AgentExecutionCanvas } from './components/canvas/AgentExecutionCanvas';
import { LandingView } from './components/canvas/LandingView';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showAuth, setShowAuth] = useState(true);

  if (!hasStartedChat) {
    return (
        <>
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            <LandingView onStartChat={() => {setHasStartedChat(true); setShowAuth(false);}} />
        </>
    );
  }

  return (
    <AppLayout>
        <AgentExecutionCanvas />
    </AppLayout>
  );
}
