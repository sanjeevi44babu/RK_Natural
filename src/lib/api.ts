// =====================
// API ERROR CLASS
// =====================
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status = 500, data: any = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// =====================
// BASE URL (IMPORTANT)
// =====================
// Backend running on: http://localhost:5000
// API mounted at: /api
const API_BASE = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
).replace(/\/$/, "");

// =====================
// AUTH TOKEN HELPERS
// =====================
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("auth_token");
}

// =====================
// SAFE JSON PARSER
// =====================
async function parseJsonSafe(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

// =====================
// CORE REQUEST METHOD
// =====================
export async function request<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) ?? {}),
  };

  // Auto JSON header
  if (init.body && !(init.body instanceof FormData)) {
    headers["Content-Type"] =
      headers["Content-Type"] ?? "application/json";
  }

  // Attach token
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 204) return null as T;

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

// =====================
// HTTP HELPERS
// =====================
export const apiGet = <T = any>(path: string) =>
  request<T>(path, { method: "GET" });

export const apiPost = <T = any>(path: string, body?: any) =>
  request<T>(path, {
    method: "POST",
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

export const apiPut = <T = any>(path: string, body?: any) =>
  request<T>(path, {
    method: "PUT",
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

export const apiDelete = <T = any>(path: string) =>
  request<T>(path, { method: "DELETE" });

// =====================
// RESOURCE HELPERS
// =====================
export const createResource = <T = any>(resource: string, body: any) =>
  apiPost<T>(`/${resource.replace(/^\//, "")}`, body);

export const updateResource = <T = any>(
  resource: string,
  id: string,
  body: any
) => apiPut<T>(`/${resource.replace(/^\//, "")}/${id}`, body);

export const deleteResource = (resource: string, id: string) =>
  apiDelete(`/${resource.replace(/^\//, "")}/${id}`);

// =====================
// DOMAIN HELPERS
// =====================
export const createUser = (body: any) =>
  createResource("users", body);
export const updateUserById = (id: string, body: any) =>
  updateResource("users", id, body);

export const createPatient = (body: any) =>
  createResource("patients", body);
export const updatePatientById = (id: string, body: any) =>
  updateResource("patients", id, body);

export const createAppointment = (body: any) =>
  createResource("appointments", body);
export const updateAppointmentById = (id: string, body: any) =>
  updateResource("appointments", id, body);

export const updateBedById = (id: string, body: any) =>
  updateResource("beds", id, body);

export const createHealthRecord = (body: any) =>
  createResource("health-records", body);

// =====================
// AUTH HELPERS (ADDED)
// =====================
export async function loginRequest(payload: {
  email: string;
  password: string;
}) {
  const data = await apiPost<{ token: string; user: any }>(
    "/auth/login",
    payload
  );
  if (data?.token) setAuthToken(data.token);
  return data;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost("/auth/register", payload);
}

export async function getMe() {
  return apiGet("/auth/me");
}

export function logout() {
  clearAuthToken();
}

// =====================
// DEFAULT EXPORT
// =====================
export default {
  request,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  loginRequest,
  registerRequest,
  getMe,
  logout,
  setAuthToken,
  clearAuthToken,
};
