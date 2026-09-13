import type { ExamRoom, JLPTLevel, FormQuotaStat, LevelsResponse, RoomSearchResult } from './types';

const TOKEN_KEY = 'jlpt_jwt_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public endpoints
  async getLevels(): Promise<LevelsResponse> {
    const res = await fetch('/api/levels');
    if (!res.ok) throw new Error('Failed to fetch level stats');
    const data = await res.json();
    return {
      examYear: data.examYear || '2026',
      examDate: data.examDate || '2026-07-05',
      campusMap: data.campusMap || '',
      formQuota: {
        totalQuota: data.formQuota?.totalQuota ?? 500,
        totalRegistered: data.formQuota?.totalRegistered ?? 0,
        remaining: data.formQuota?.remaining ?? 0,
        isFull: data.formQuota?.isFull ?? false,
      },
      levels: (data.levels || []).map((d: any) => ({
        level: d.level,
        registered: d.registeredCount,
        fee: d.fee,
        testTime: d.testTime,
      })),
    };
  },

  async getRooms(): Promise<ExamRoom[]> {
    const res = await fetch('/api/rooms');
    if (!res.ok) throw new Error('Failed to fetch rooms');
    const data = await res.json();
    return data.map((r: any) => ({
      id: r.id,
      code: r.code,
      building: r.building,
      floor: r.floor,
      level: r.level,
      capacity: r.capacity,
      imageUrl: r.imageUrl || '',
      examinees: [], // loaded on demand for privacy and performance
      examineeCount: r.examineeCount,
    }));
  },

  async getRoomApplicants(roomId: string): Promise<{ room: any; applicants: any[] }> {
    const res = await fetch(`/api/rooms/${roomId}/applicants`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) throw new Error('Failed to fetch room applicants');
    return res.json();
  },

  async searchRoomsByName(query: string): Promise<RoomSearchResult[]> {
    if (!query.trim()) return [];
    const res = await fetch(`/api/applicants/search?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  },

  logout() {
    setAuthToken(null);
  },

  async changeAdminCredentials(params: {
    currentPassword: string;
    newUsername?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch('/api/auth/change-credentials', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update credentials');
    }
    const data = await res.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async getAdminUsers(): Promise<{ users: { id: string; username: string; role: string; created_at: string }[] }> {
    const res = await fetch('/api/auth/users', {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch admin users');
    }
    return res.json();
  },

  async createAdminUser(params: { username: string; password: string; role?: string }): Promise<{ success: boolean; user: any }> {
    const res = await fetch('/api/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create admin user');
    }
    return res.json();
  },

  async deleteAdminUser(userId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/auth/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete admin user');
    }
    return res.json();
  },

  // Admin Level Actions
  async incrementLevel(level: JLPTLevel) {
    const res = await fetch(`/api/levels/${level}/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to increment');
    }
    return res.json();
  },

  async updateGlobalQuota(totalQuota: number, formsSold?: number): Promise<{ formQuota: FormQuotaStat }> {
    const res = await fetch('/api/levels/quota', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ totalQuota, formsSold }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update total form quota');
    }
    return res.json();
  },

  async updateFormsSold(formsSold: number): Promise<{ formQuota: FormQuotaStat }> {
    const res = await fetch('/api/levels/sold', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ formsSold }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update forms sold');
    }
    return res.json();
  },

  async updateExamYear(examYear: string): Promise<{ examYear: string }> {
    const res = await fetch('/api/levels/year', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ examYear }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update exam year');
    }
    return res.json();
  },

  async updateExamDate(examDate: string): Promise<{ examDate: string }> {
    const res = await fetch('/api/levels/date', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ examDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update exam date');
    }
    return res.json();
  },

  async updateExamSchedule(examYear: string, examDate: string): Promise<{ examYear: string; examDate: string }> {
    const res = await fetch('/api/levels/schedule', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ examYear, examDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update exam schedule');
    }
    return res.json();
  },

  async updateLevel(
    level: string,
    data: number | { registeredCount?: number; fee?: number; testTime?: string }
  ) {
    const payload = typeof data === 'number' ? { registeredCount: data } : data;
    const res = await fetch(`/api/levels/${level}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update exam level');
    }
    return res.json();
  },

  // Admin: Update Campus Map
  async updateCampusMap(campusMap: string) {
    const res = await fetch('/api/levels/campus-map', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ campusMap }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update campus map');
    }
    return res.json();
  },

  // Admin Room Actions
  async createRoom(roomData: { code: string; building: string; floor: string; level: string; capacity: number; imageUrl?: string }) {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create room');
    }
    return res.json();
  },

  async updateRoom(id: string, roomData: { code: string; building: string; floor: string; level: string; capacity: number; imageUrl?: string }) {
    const res = await fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update room');
    }
    return res.json();
  },

  async deleteRoom(id: string) {
    const res = await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error('Failed to delete room');
    return res.json();
  },

  // Admin Applicant Actions
  async addApplicant(roomId: string, firstName: string, lastName: string) {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ roomId, firstName, lastName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add applicant');
    }
    return res.json();
  },

  async batchAddApplicants(roomId: string, applicants: { firstName: string; lastName: string }[]) {
    const res = await fetch('/api/applicants/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ roomId, applicants }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to batch add applicants');
    }
    return res.json();
  },

  async importCSV(roomId: string, csvContent: string) {
    const res = await fetch('/api/applicants/import-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ roomId, csvContent }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to import CSV');
    }
    return res.json();
  },

  async deleteApplicant(id: string) {
    const res = await fetch(`/api/applicants/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error('Failed to delete applicant');
    return res.json();
  },

  // Reset Demo
  async resetDemo() {
    const res = await fetch('/api/reset-demo', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  },
};

// Real-time SSE subscriber
export function subscribeToSSE(onUpdate: (event: string, data: any) => void): () => void {
  const eventSource = new EventSource('/api/events');

  const handleEvent = (eventName: string) => (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data || '{}');
      onUpdate(eventName, data);
    } catch {
      onUpdate(eventName, {});
    }
  };

  eventSource.addEventListener('levels_updated', handleEvent('levels_updated'));
  eventSource.addEventListener('rooms_updated', handleEvent('rooms_updated'));
  eventSource.addEventListener('applicants_updated', handleEvent('applicants_updated'));

  return () => {
    eventSource.close();
  };
}
