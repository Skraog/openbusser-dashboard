export const sessionStorage = {
  setSession(sessionId: string, token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openBusserSessionId', sessionId);
      localStorage.setItem('openBusserSessionToken', token);
    }
  },

  getSession() {
    if (typeof window !== 'undefined') {
      return {
        sessionId: localStorage.getItem('openBusserSessionId'),
        token: localStorage.getItem('openBusserSessionToken')
      };
    }
    return { sessionId: null, token: null };
  },

  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openBusserSessionId');
      localStorage.removeItem('openBusserSessionToken');
    }
  },

  hasValidSession() {
    const { sessionId, token } = this.getSession();
    return !!(sessionId && token);
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
};

export const isRecentlyActive = (lastHeartbeat: string, maxAgeSeconds: number = 30): boolean => {
  const heartbeatTime = new Date(lastHeartbeat).getTime();
  const now = new Date().getTime();
  return (now - heartbeatTime) / 1000 <= maxAgeSeconds;
};
