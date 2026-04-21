import { useMemo, useSyncExternalStore } from "react";
import type { AuthUser } from "@/types/auth";
import { AUTH_USER_KEY } from "@/services/authService";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot(): string {
  return localStorage.getItem(AUTH_USER_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

export function useAuthUser(): AuthUser | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }, [raw]);
}
