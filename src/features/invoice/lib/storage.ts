const K = "invoice-maker@state";
export const save = (obj: unknown) => localStorage.setItem(K, JSON.stringify(obj));
export const load = <T>(fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(K) || "") as T; } catch { return fallback; }
};
