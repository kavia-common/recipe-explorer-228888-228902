import { useEffect, useMemo, useState } from "react";

/**
 * Safely parse JSON from localStorage.
 * We intentionally keep this internal to the hook to avoid duplicated try/catch.
 */
function safeJsonParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify JSON for localStorage.
 */
function safeJsonStringify(value, fallback = "null") {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export default function useLocalStorage(key, initialValue) {
  /**
   * React hook that mirrors a piece of state into window.localStorage.
   *
   * - Reads from localStorage on first render (lazy init).
   * - Writes on changes.
   * - Listens to the "storage" event to stay in sync across browser tabs.
   *
   * @param {string} key localStorage key
   * @param {any|function} initialValue initial value (or lazy initializer)
   * @returns {[any, function]} tuple of [value, setValue]
   */
  const storageKey = String(key || "");

  const getInitial = useMemo(() => {
    return () => {
      if (!storageKey) {
        return typeof initialValue === "function" ? initialValue() : initialValue;
      }

      // localStorage may be unavailable in some environments; fail gracefully.
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw !== null) {
          return safeJsonParse(raw, typeof initialValue === "function" ? initialValue() : initialValue);
        }
      } catch {
        // Ignore and fall back to initialValue
      }

      return typeof initialValue === "function" ? initialValue() : initialValue;
    };
  }, [storageKey, initialValue]);

  const [value, setValue] = useState(getInitial);

  useEffect(() => {
    if (!storageKey) return;

    try {
      window.localStorage.setItem(storageKey, safeJsonStringify(value));
    } catch {
      // If storage is full/blocked, we still keep in-memory state.
    }
  }, [storageKey, value]);

  useEffect(() => {
    if (!storageKey) return undefined;

    const onStorage = (event) => {
      if (event.storageArea !== window.localStorage) return;
      if (event.key !== storageKey) return;

      const next = safeJsonParse(event.newValue, typeof initialValue === "function" ? initialValue() : initialValue);
      setValue(next);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey, initialValue]);

  return [value, setValue];
}
