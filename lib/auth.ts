"use client";

const ADMIN_KEY = "wishwithme_admin_auth";

export function setAdminAuth(password: string): boolean {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "wishwithme2024";
  if (password === adminPassword) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_KEY);
}
