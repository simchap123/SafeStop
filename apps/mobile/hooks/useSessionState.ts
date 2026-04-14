import { useState, useCallback } from 'react';
import { Session, SessionState, Stop, Confirmation } from '../lib/types';

interface UseSessionStateReturn {
  session: Session | null;
  startSession: (childId: string, destinationId?: string) => void;
  endSession: () => void;
  updateState: (state: SessionState) => void;
  addStop: (stop: Omit<Stop, 'id' | 'sessionId'>) => void;
  confirmStop: (stopId: string, confirmation: Omit<Confirmation, 'id' | 'stopId'>) => void;
  isActive: boolean;
}

let nextId = 100;
function generateId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

export function useSessionState(): UseSessionStateReturn {
  const [session, setSession] = useState<Session | null>(null);

  const isActive = session !== null && session.state !== SessionState.IDLE && session.state !== SessionState.CONFIRMED_SAFE;

  const startSession = useCallback((childId: string, destinationId?: string) => {
    setSession({
      id: generateId('session'),
      familyId: 'family-1',
      driverId: 'user-1',
      childId,
      destinationId,
      state: SessionState.DRIVING,
      startedAt: new Date().toISOString(),
      stops: [],
    });
  }, []);

  const endSession = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null;
      return { ...prev, state: SessionState.IDLE, endedAt: new Date().toISOString() };
    });
  }, []);

  const updateState = useCallback((state: SessionState) => {
    setSession((prev) => (prev ? { ...prev, state } : null));
  }, []);

  const addStop = useCallback((stopData: Omit<Stop, 'id' | 'sessionId'>) => {
    setSession((prev) => {
      if (!prev) return null;
      const stop: Stop = {
        ...stopData,
        id: generateId('stop'),
        sessionId: prev.id,
      };
      return {
        ...prev,
        state: SessionState.STOP_DETECTED,
        stops: [...prev.stops, stop],
      };
    });
  }, []);

  const confirmStop = useCallback((stopId: string, confirmationData: Omit<Confirmation, 'id' | 'stopId'>) => {
    setSession((prev) => {
      if (!prev) return null;
      const confirmation: Confirmation = {
        ...confirmationData,
        id: generateId('conf'),
        stopId,
      };
      return {
        ...prev,
        state: SessionState.CONFIRMED_SAFE,
        stops: prev.stops.map((s) =>
          s.id === stopId ? { ...s, confirmation } : s
        ),
      };
    });
  }, []);

  return {
    session,
    startSession,
    endSession,
    updateState,
    addStop,
    confirmStop,
    isActive,
  };
}
