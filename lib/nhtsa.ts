type CacheEntry<T> = { data: T; timestamp: number };

const CACHE_TTL = 24 * 60 * 60 * 1000;
const recallCache = new Map<string, CacheEntry<string[]>>();
const complaintCache = new Map<string, CacheEntry<string[]>>();

function cacheKey(make: string, model: string, year: string): string {
  return `${make}|${model}|${year}`.toLowerCase();
}

function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export async function getVehicleRecalls(
  make: string,
  model: string,
  year: string,
): Promise<string[]> {
  const key = cacheKey(make, model, year);
  const cached = getCached(recallCache, key);
  if (cached) return cached;

  try {
    const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];

    const data = await res.json();
    const results: string[] = (data.results || [])
      .slice(0, 10)
      .map((r: { Component?: string; Summary?: string }) => {
        const component = r.Component || "Unknown component";
        const summary = r.Summary || "No details";
        return `${component}: ${summary.slice(0, 200)}`;
      });

    recallCache.set(key, { data: results, timestamp: Date.now() });
    return results;
  } catch {
    return [];
  }
}

export async function getVehicleComplaints(
  make: string,
  model: string,
  year: string,
): Promise<string[]> {
  const key = cacheKey(make, model, year);
  const cached = getCached(complaintCache, key);
  if (cached) return cached;

  try {
    const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];

    const data = await res.json();
    const results: string[] = (data.results || [])
      .slice(0, 10)
      .map((c: { components?: string; summary?: string }) => {
        const component = c.components || "Unknown";
        const summary = c.summary || "No details";
        return `${component}: ${summary.slice(0, 200)}`;
      });

    complaintCache.set(key, { data: results, timestamp: Date.now() });
    return results;
  } catch {
    return [];
  }
}
