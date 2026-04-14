import { Platform } from 'react-native';

// ─── Cross-Platform Storage Abstraction ────────────────────────────────────
// Web: localStorage | Native: in-memory fallback (swap for AsyncStorage later)

const memoryStore: Record<string, string> = {};

/**
 * Get an item from storage by key.
 * Returns null if the key does not exist.
 */
export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  // Native fallback — replace with AsyncStorage or expo-secure-store
  return memoryStore[key] ?? null;
}

/**
 * Set an item in storage.
 */
export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage full or unavailable — silently fail
    }
    return;
  }
  memoryStore[key] = value;
}

/**
 * Remove a single item from storage.
 */
export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return;
  }
  delete memoryStore[key];
}

/**
 * Clear all SafeStop keys from storage.
 */
export async function clear(): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith('safestop:')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    return;
  }
  for (const k of Object.keys(memoryStore)) {
    if (k.startsWith('safestop:')) {
      delete memoryStore[k];
    }
  }
}
