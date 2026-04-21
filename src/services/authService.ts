import api from "../lib/api";

export const AUTH_USER_KEY = "auth_user";

// Define the shape of the payload for the New User / Sync flow
export interface LoginSyncPayload {
  email: string;
  password: string;
  confirm_password?: string;
  role: string;
}

function roleFromLoginPayload(data: Record<string, unknown>): "staff" | "student" | undefined {
  const r = data.role;
  return r === "staff" || r === "student" ? r : undefined;
}

function normalizeAppRole(value: unknown): "staff" | "student" | undefined {
  if (value === "staff" || value === "student") return value;
  if (typeof value !== "string") return undefined;
  const v = value.trim().toLowerCase();
  if (["lecturer", "faculty", "instructor", "teacher", "staff", "ta"].includes(v)) return "staff";
  if (["student", "learner"].includes(v)) return "student";
  return undefined;
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
}

function persistAuthUserFromResponse(data: Record<string, unknown>) {
  const topRole = roleFromLoginPayload(data);
  let userObj: Record<string, unknown>;

  if (data.user && typeof data.user === "object" && !Array.isArray(data.user)) {
    userObj = { ...(data.user as Record<string, unknown>) };
  } else if (typeof data.username === "string") {
    userObj = { username: data.username };
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  const rawRoleStr = typeof userObj.role === "string" ? userObj.role.trim() : "";
  const normalizedRole =
    topRole ?? normalizeAppRole(userObj.role) ?? normalizeAppRole(data.role);

  if (normalizedRole) userObj.role = normalizedRole;
  else delete userObj.role;

  const displayName = firstNonEmptyString(
    userObj.display_name,
    userObj.displayName,
    userObj.full_name,
    userObj.name,
    data.display_name,
    data.displayName,
    data.full_name,
    data.name,
  );
  if (displayName) userObj.displayName = displayName;

  let roleDisplay = firstNonEmptyString(
    userObj.role_display,
    userObj.roleDisplay,
    userObj.role_label,
    userObj.role_name,
    data.role_display,
    data.roleDisplay,
    data.role_label,
    data.role_name,
  );
  const topRoleStr = typeof data.role === "string" ? data.role.trim() : "";
  if (!roleDisplay && rawRoleStr) {
    const low = rawRoleStr.toLowerCase();
    if (low !== "staff" && low !== "student") roleDisplay = rawRoleStr;
  }
  if (!roleDisplay && topRoleStr) {
    const low = topRoleStr.toLowerCase();
    if (low !== "staff" && low !== "student") roleDisplay = topRoleStr;
  }
  if (roleDisplay) userObj.roleDisplay = roleDisplay;

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
}

export const authService = {
  login: async (credentials: any) => {
    // Note: hitting the /users/ namespace we defined in Django
    const response = await api.post("users/login/", credentials);

    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_role", response.data.role);
      persistAuthUserFromResponse(response.data as Record<string, unknown>);
    }

    return { status: response.status, data: response.data };
  },

  // The sync method for First-Time Setup
  loginSync: async (data: LoginSyncPayload) => {
    // Uses your custom api instance to hit the exact same endpoint
    const response = await api.post("users/login/", data);
    return response;
  },

  // 🚀 NEW: The Verification Courier
  verifyEmail: async (token: string) => {
    // Send the token to the backend using a GET request
    const response = await api.get(`users/verify/${token}/`);

    // If the backend hands over the keys, save them just like a normal login!
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_role", response.data.role);
      persistAuthUserFromResponse(response.data as Record<string, unknown>);
    }

    return response;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem(AUTH_USER_KEY);
  },
};