'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { openBusserAPI } from '@/lib/api';
import { sessionStorage } from '@/lib/utils';
import Link from 'next/link';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get('id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!inviteId) {
      setStatus('invalid');
      setMessage('Lien d\'invitation invalide');
      return;
    }

    const initializeSession = async () => {
      try {
        const session = sessionStorage.getSession();

        if (!session.sessionId || !session.token) {
          // Register new session if none exists
          const newSession = await openBusserAPI.registerSession();
          sessionStorage.setSession(newSession.id, newSession.token);
        }

        setStatus('success');
        setMessage('Invitation acceptée avec succès ! Vous pouvez maintenant accéder au tableau de bord.');
      } catch {
        setStatus('error');
        setMessage('Erreur lors de l\'acceptation de l\'invitation');
      }
    };

    initializeSession();
  }, [inviteId]);

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                🚌 OpenBusser
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Traitement de l&apos;invitation...
              </h1>
              <p className="text-gray-300">
                Veuillez patienter pendant que nous configurons votre accès.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Invitation Acceptée !
              </h1>
              <p className="text-gray-300 mb-8">
                {message}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                >
                  Accéder au Tableau de Bord
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full px-6 py-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                  Retour à l&apos;Accueil
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Erreur
              </h1>
              <p className="text-gray-300 mb-8">
                {message}
              </p>
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
              >
                Retour à l&apos;Accueil
              </button>
            </>
          )}

          {status === 'invalid' && (
            <>
              <div className="text-6xl mb-6">⚠️</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Invitation Invalide
              </h1>
              <p className="text-gray-300 mb-8">
                {message}
              </p>
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
              >
                Retour à l&apos;Accueil
              </button>
            </>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            À propos des Invitations OpenBusser
          </h2>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              • Les invitations permettent de partager l&apos;accès aux appareils OpenBusser
            </p>
            <p>
              • Votre session est liée à votre adresse IP pour des raisons de sécurité
            </p>
            <p>
              • Les sessions expirent automatiquement après 30 minutes d&apos;inactivité
            </p>
            <p>
              • Toutes les communications restent sur le réseau local
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white">Chargement...</p>
      </div>
    </div>}>
      <InvitePageContent />
    </Suspense>
  );
}
