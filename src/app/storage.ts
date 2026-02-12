export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export const LS_KEYS = {
  designers: "sd3d_designers",
  objects: "sd3d_objects",
} as const;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
