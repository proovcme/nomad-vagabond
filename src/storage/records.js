/**
 * Persistent storage for mission records & user preferences (safe in Node / private browsing).
 */

const SETTINGS_KEY = 'nomad_settings_v1';

export function getMissionRecord(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(`nomad_rec_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMissionRecord(id, timeSec, kills) {
  if (!id) return;
  try {
    const prev = getMissionRecord(id);
    const bestTime = prev ? Math.min(prev.time, Math.round(timeSec)) : Math.round(timeSec);
    const bestKills = prev ? Math.max(prev.kills, kills) : kills;
    localStorage.setItem(`nomad_rec_${id}`, JSON.stringify({ time: bestTime, kills: bestKills }));
  } catch {}
}

export function loadUserSettings() {
  const defaults = { quality: 'medium', hudScale: 1, invertPitch: false, mouseAim: false, soundOn: true };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveUserSettings(patch) {
  try {
    const cur = loadUserSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...cur, ...patch }));
  } catch {}
}
