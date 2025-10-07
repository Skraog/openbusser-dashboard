'use client';

import { useState, useEffect } from 'react';
import { openBusserAPI } from '@/lib/api';
import { sessionStorage, formatTimeAgo, isRecentlyActive } from '@/lib/utils';
import { AvailableBusser, Session, Invite } from '@/lib/types';
import Link from 'next/link';

interface BusserWithStatus extends AvailableBusser {
  status: 'online' | 'offline';
  lastIp?: string;
}

export default function Dashboard() {
  const [sessionData, setSessionData] = useState<{ id: string; token: string } | null>(null);
  const [availableBussers, setAvailableBussers] = useState<BusserWithStatus[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusser, setSelectedBusser] = useState<string>('');
  const [knownBussers, setKnownBussers] = useState<Map<string, BusserWithStatus>>(new Map());

  useEffect(() => {
    const session = sessionStorage.getSession();
    if (!session.sessionId || !session.token) {
      window.location.href = '/';
      return;
    }
    setSessionData({ id: session.sessionId, token: session.token });

    loadDashboardData(session.sessionId, session.token);
  }, []);

  useEffect(() => {
    if (!sessionData) return;

    const interval = setInterval(() => {
      loadDashboardData(sessionData.id, sessionData.token);
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionData]);

  const loadDashboardData = async (sessionId: string, token: string) => {
    try {
      setLoading(true);

      const [matchResult, sessionsResult, invitesResult] = await Promise.all([
        openBusserAPI.findAvailableBussers(sessionId, token),
        openBusserAPI.listSessions(),
        openBusserAPI.listInvites()
      ]);

      // Update busser status logic
      const currentBussers = matchResult?.availableBussers || [];
      const newKnownBussers = new Map(knownBussers);

      // Mark current bussers as online
      currentBussers.forEach(busser => {
        newKnownBussers.set(busser.id, {
          ...busser,
          status: 'online',
          lastIp: matchResult.fromIp
        });
      });

      // Mark previously known bussers that are no longer available as offline
      knownBussers.forEach((busser, id) => {
        if (!currentBussers.find(b => b.id === id)) {
          newKnownBussers.set(id, {
            ...busser,
            status: 'offline'
          });
        }
      });

      setKnownBussers(newKnownBussers);
      setAvailableBussers(Array.from(newKnownBussers.values()));
      setSessions(sessionsResult || []);
      setInvites(invitesResult?.invites || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loading error');
      // Set fallback values when API calls fail
      setAvailableBussers(Array.from(knownBussers.values()).map(b => ({ ...b, status: 'offline' })));
      setSessions([]);
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvite = async () => {
    if (!sessionData || !selectedBusser) return;

    try {
      await openBusserAPI.createInvite(selectedBusser, sessionData.id, sessionData.token);
      await loadDashboardData(sessionData.id, sessionData.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating invitation');
    }
  };

  const handleBackToDetection = () => {
    window.location.href = '/';
  };

  if (loading && !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
        <div className="text-center z-10">
          <div className="relative w-8 h-8 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const onlineBussers = availableBussers.filter(b => b.status === 'online');
  const offlineBussers = availableBussers.filter(b => b.status === 'offline');

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Same background as homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-white">
                🚌 OpenBusser
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/*<button*/}
              {/*  onClick={handleBackToDetection}*/}
              {/*  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 text-gray-300 hover:text-white text-sm"*/}
              {/*>*/}
              {/*  Re-detect*/}
              {/*</button>*/}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 animate-fadeIn">
            <span className="text-red-400">⚠️ {error}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage your OpenBusser devices and monitor active connections
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600/20 rounded-lg mr-4">
                <span className="text-2xl">🚌</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Devices</p>
                <p className="text-2xl font-bold text-white">{availableBussers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp delay-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-600/20 rounded-lg mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Online</p>
                <p className="text-2xl font-bold text-white">{onlineBussers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp delay-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600/20 rounded-lg mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-white">{sessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp delay-300">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600/20 rounded-lg mr-4">
                <span className="text-2xl">📩</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Invitations</p>
                <p className="text-2xl font-bold text-white">{invites.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Generation */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8 animate-fadeInUp delay-400">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Invitation Link</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select a device
              </label>
              <select
                value={selectedBusser}
                onChange={(e) => setSelectedBusser(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a device...</option>
                {onlineBussers.map((busser) => (
                  <option key={busser.id} value={busser.id}>
                    Device {busser.id.slice(0, 8)}... ({busser.lastIp})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerateInvite}
              disabled={!selectedBusser}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all duration-300 text-white hover:scale-105 disabled:hover:scale-100"
            >
              Generate Invitation
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Devices */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp delay-500">
            <h2 className="text-xl font-semibold text-white mb-4">Available Devices</h2>
            <div className="space-y-3">
              {availableBussers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-400">No devices found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Make sure your OpenBusser device is connected to the same network
                  </p>
                </div>
              ) : (
                <>
                  {onlineBussers.map((busser, index) => (
                    <div
                      key={busser.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 animate-fadeInUp"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-white mb-1">
                            Device {busser.id.slice(0, 8)}...
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>IP: {busser.lastIp}</span>
                            <span>
                              Last activity: {formatTimeAgo(busser.lastHeartbeat)}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs bg-green-900/40 text-green-400">
                          Online
                        </span>
                      </div>
                    </div>
                  ))}

                  {offlineBussers.map((busser, index) => (
                    <div
                      key={busser.id}
                      className="bg-gray-800/30 rounded-lg p-4 border border-gray-800 opacity-60 animate-fadeInUp"
                      style={{ animationDelay: `${600 + (onlineBussers.length + index) * 100}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-400 mb-1">
                            Device {busser.id.slice(0, 8)}...
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>IP: {busser.lastIp || 'Unknown'}</span>
                            <span>
                              Last seen: {formatTimeAgo(busser.lastHeartbeat)}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs bg-red-900/40 text-red-400">
                          Offline
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Active Invitations */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-fadeInUp delay-600">
            <h2 className="text-xl font-semibold text-white mb-4">Active Invitations</h2>
            <div className="space-y-3">
              {invites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📬</div>
                  <p className="text-gray-400">No active invitations</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Generate an invitation link to share device access
                  </p>
                </div>
              ) : (
                invites.map((invite, index) => (
                  <div
                    key={invite.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 animate-fadeInUp"
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">
                          Invitation {invite.id.slice(0, 8)}...
                        </h3>
                        <p className="text-sm text-gray-400">
                          Device: {invite.busserId.slice(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-400">
                          Created: {formatTimeAgo(invite.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        invite.accepted
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-blue-900/40 text-blue-400'
                      }`}>
                        {invite.accepted ? 'Accepted' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
