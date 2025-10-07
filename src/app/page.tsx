'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { openBusserAPI } from '@/lib/api';
import { sessionStorage } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAndDetect = async () => {
      try {
        setIsDetecting(true);
        setError(null);

        // First, register a session if we don't have one
        const existing = sessionStorage.getSession();
        let sessionId: string, token: string;

        if (existing.sessionId && existing.token) {
          sessionId = existing.sessionId;
          token = existing.token;
        } else {
          // Register new session
          const session = await openBusserAPI.registerSession();
          sessionStorage.setSession(session.id, session.token);
          sessionId = session.id;
          token = session.token;
        }

        // Now check for available bussers
        const result = await openBusserAPI.findAvailableBussers(sessionId, token);

        if (mounted && result.availableBussers && result.availableBussers.length > 0) {
          // Auto-assign the first available busser
          const firstBusser = result.availableBussers[0];
          try {
            await openBusserAPI.assignBusser(firstBusser.id, sessionId, token);
            console.log(`Successfully assigned busser ${firstBusser.id} to session ${sessionId}`);

            // Show assignment success and redirect to dashboard
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500); // Show detection for 1.5 seconds before redirecting
          } catch (assignError) {
            console.error('Failed to assign busser:', assignError);
            setError(assignError instanceof Error ? assignError.message : 'Failed to assign busser');
          }
        }
      } catch (error) {
        console.error('Error during initialization/detection:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Connection failed');
        }
      }
    };

    // Initial check
    initializeAndDetect();

    // Then check every 5 seconds
    const interval = setInterval(initializeAndDetect, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Fond simple avec grille subtile */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Effet de vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-gray-500 mb-6 tracking-wide animate-fade-in">
            Welcome to
          </h2>

          {/* OpenBusser avec animation d'écriture */}
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-16 tracking-tight">
            <span className="inline-block animate-typing">
              OpenBusser
            </span>
          </h1>
        </div>

        {/* Message et loader sur la même ligne */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Logo de chargement - toujours en rotation */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 border-2 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>

          {/* Texte */}
          <p className="text-lg md:text-xl text-gray-400 font-light">
            {error ? 'Connection error - retrying...' : 'Detecting your busser...'}
          </p>
        </div>

        {/* Instructions supplémentaires */}
        <div className="mt-12 text-gray-500 text-sm max-w-md mx-auto">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <p>Make sure your OpenBusser device is connected to the same network.</p>
          )}
        </div>
      </div>
    </div>
  );
}
