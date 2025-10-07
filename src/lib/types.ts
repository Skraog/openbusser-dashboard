export interface Busser {
  id: string;
  lastIp: string;
  createdAt: string;
  lastHeartbeat: string;
  sessionId?: string | null;
}

export interface Session {
  id: string;
  lastIp: string;
  createdAt: string;
  lastHeartbeat: string;
}

export interface Invite {
  id: string;
  busserId: string;
  sessionId: string;
  createdAt: string;
  accepted: boolean;
}

export interface MatchResponse {
  availableBussers: AvailableBusser[];
  sessionId: string;
  fromIp: string;
  lastChecked: string;
}

export interface AvailableBusser {
  id: string;
  lastHeartbeat: string;
  sessionId?: string | null;
}

export interface RegisterResponse {
  id: string;
  token: string;
}
