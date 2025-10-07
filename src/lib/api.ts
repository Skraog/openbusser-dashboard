import { Busser, Session, Invite, MatchResponse, RegisterResponse } from './types';

class OpenBusserAPI {
  private baseUrl = '/api';

  async registerSession(): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseUrl}/session/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // OpenAPI requires empty object
    });

    if (!response.ok) {
      throw new Error(`Failed to register session: ${response.statusText}`);
    }

    return response.json();
  }

  async findAvailableBussers(sessionId: string, token: string): Promise<MatchResponse> {
    const response = await fetch(`${this.baseUrl}/session/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, token })
    });

    if (!response.ok) {
      throw new Error(`Failed to find bussers: ${response.statusText}`);
    }

    return response.json();
  }

  async assignBusser(busserId: string, sessionId: string, token: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/session/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busserId, sessionId, token })
    });

    if (!response.ok) {
      throw new Error(`Failed to assign busser: ${response.statusText}`);
    }

    return response.json();
  }

  async sendHeartbeat(sessionId: string, token: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/session/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sessionId, token }) // API expects 'id', not 'sessionId'
    });

    if (!response.ok) {
      throw new Error(`Failed to send heartbeat: ${response.statusText}`);
    }

    return response.json();
  }

  async listInvites(): Promise<{ invites: Invite[]; fromIp: string }> {
    const response = await fetch(`${this.baseUrl}/invite/list`);

    if (!response.ok) {
      throw new Error(`Failed to list invites: ${response.statusText}`);
    }

    return response.json();
  }

  async createInvite(busserId: string, sessionId: string, token: string): Promise<{ id: string }> {
    const response = await fetch(`${this.baseUrl}/invite/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busserId, sessionId, token })
    });

    if (!response.ok) {
      throw new Error(`Failed to create invite: ${response.statusText}`);
    }

    return response.json();
  }

  async listBussers(): Promise<{ bussers: Busser[]; fromIp: string }> {
    const response = await fetch(`${this.baseUrl}/busser/list`);

    if (!response.ok) {
      throw new Error(`Failed to list bussers: ${response.statusText}`);
    }

    return response.json();
  }

  async listSessions(): Promise<Session[]> {
    const response = await fetch(`${this.baseUrl}/session/list`);

    if (!response.ok) {
      throw new Error(`Failed to list sessions: ${response.statusText}`);
    }

    return response.json(); // Returns array directly, not wrapped object
  }
}

export const openBusserAPI = new OpenBusserAPI();
