// Production: пустой VITE_API_BASE_URL → запросы /api/* на тот же хост (tacticode.ru).
// Dev (npm run dev): по умолчанию http://localhost:4000.
const raw = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL =
  raw !== undefined && String(raw).trim() !== ""
    ? String(raw).trim()
    : (import.meta.env.DEV ? "http://localhost:4000" : "");

if (typeof window !== "undefined") window.__API_BASE_URL__ = API_BASE_URL;

function getToken() {
  return localStorage.getItem("accessToken") || null;
}

function getCurrentDeviceId() {
  return localStorage.getItem("currentDeviceId") || null;
}

function getDeviceKey() {
  const existing = localStorage.getItem("deviceKey");
  if (existing) return existing;

  const next =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("deviceKey", next);
  return next;
}

function setToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

function setCurrentDeviceId(deviceId) {
  if (deviceId) {
    localStorage.setItem("currentDeviceId", String(deviceId));
  } else {
    localStorage.removeItem("currentDeviceId");
  }
}

function getBrowserName(ua) {
  if (/Edg\//i.test(ua)) return "Microsoft Edge";
  if (/OPR\//i.test(ua)) return "Opera";
  if (/YaBrowser\//i.test(ua)) return "Яндекс Браузер";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/CriOS\//i.test(ua)) return "Chrome";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && /Version\//i.test(ua)) return "Safari";
  return "Браузер";
}

function getDeviceModel(ua) {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile\//i.test(ua))) return "iPad";
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android[^;)]*;\s*([^;)]+)/i);
    const rawModel = match?.[1]?.replace(/\s+Build\/.*/i, "").trim();
    return rawModel && !/wv|mobile/i.test(rawModel) ? rawModel : "Android";
  }
  if (/Windows NT/i.test(ua)) return "Windows PC";
  if (/Mac OS X|Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux PC";
  return "Устройство";
}

function getReadableDeviceName(ua) {
  return `${getBrowserName(ua)} · ${getDeviceModel(ua)}`;
}

function normalizeStoredDeviceName(deviceName) {
  const value = String(deviceName || "").trim();
  return /Mozilla\/|AppleWebKit\//i.test(value) ? getReadableDeviceName(value) : value;
}

function mapDevice(device) {
  const defaultName = normalizeStoredDeviceName(device.device_name);
  return {
    id: device.id,
    name: device.display_name || defaultName,
    defaultName,
    displayName: device.display_name || "",
    location: device.last_active_at
      ? new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(device.last_active_at))
      : "",
    createdAt: device.created_at,
    lastActiveAt: device.last_active_at,
    deviceType: device.device_type,
  };
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const currentDeviceId = getCurrentDeviceId();
  if (currentDeviceId) {
    headers["X-Device-Id"] = currentDeviceId;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.error) ||
      data?.message ||
      `Ошибка запроса (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.code = data?.code || null;
    error.payload = data;
    error.email = data?.email || null;
    throw error;
  }

  return data;
}

export async function apiRegister({ login, email, password }) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ login, email, password }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiLogin({ identifier, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiAdminRequestCode({ email }) {
  return request("/api/auth/admin/request-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function apiAdminConfirmCode({ email, code }) {
  const data = await request("/api/auth/admin/confirm-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiRegisterRequestCode({ email, password }) {
  return request("/api/auth/register/request-code", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegisterConfirm({ email, code }) {
  const data = await request("/api/auth/register/confirm", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiPasswordRequestReset({ email, identifier }) {
  return request("/api/auth/password/request-reset", {
    method: "POST",
    body: JSON.stringify({ email, identifier }),
  });
}

export async function apiPasswordVerifyCode({ email, code }) {
  return request("/api/auth/password/verify-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function apiPasswordReset({ email, code, password }) {
  const data = await request("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ email, code, password }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiUpdateProfileDetails({ surname, firstName, birthDate, club }) {
  const data = await request("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ surname, firstName, birthDate, club }),
  });
  return data.user;
}

export async function apiGetMe() {
  const data = await request("/api/auth/me");
  return data.user;
}

export function apiLogout() {
  setToken(null);
  setCurrentDeviceId(null);
}

export async function apiUpdateMe({ login, email }) {
  const data = await request("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ login, email }),
  });
  return data.user;
}

export async function apiUpdateMyPassword({ password }) {
  const data = await request("/api/auth/me/password", {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiRequestLoginChange(login) {
  return request("/api/auth/me/request-login-change", {
    method: "POST",
    body: JSON.stringify({ login: String(login).trim() }),
  });
}

export async function apiConfirmLoginChange({ login, code }) {
  const data = await request("/api/auth/me/confirm-login-change", {
    method: "POST",
    body: JSON.stringify({ login: String(login).trim(), code: String(code).trim() }),
  });
  setToken(data.accessToken);
  return data.user;
}

export async function apiRegisterDevice({ deviceName, deviceType }) {
  const readableDeviceName = getReadableDeviceName(deviceName);
  const data = await request("/api/devices/register", {
    method: "POST",
    body: JSON.stringify({
      device_key: getDeviceKey(),
      device_name: readableDeviceName,
      device_type: deviceType,
    }),
  });
  if (data.accessToken) {
    setToken(data.accessToken);
  }
  setCurrentDeviceId(data.device?.id || null);
  return mapDevice(data.device);
}

export async function apiGetDevices() {
  const data = await request("/api/devices");
  return (data.devices || []).map(mapDevice);
}

export async function apiRenameDevice(id, displayName) {
  const data = await request(`/api/devices/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ display_name: String(displayName || "").trim() }),
  });
  return mapDevice(data.device);
}

export async function apiDeleteDevice(id) {
  const deletedCurrentDevice = String(getCurrentDeviceId()) === String(id);
  await request(`/api/devices/${id}`, {
    method: "DELETE",
  });
  if (deletedCurrentDevice) {
    setCurrentDeviceId(null);
  }
  return { deletedCurrentDevice };
}

export async function apiGetSubscriptions() {
  const data = await request("/api/subscriptions");
  return data.subscriptions || [];
}

export async function apiGetSubscriptionHistory() {
  const data = await request("/api/subscriptions/history");
  return data.history || [];
}

export async function apiActivateSubscription({ sportId, plan, method }) {
  return request("/api/subscriptions/activate", {
    method: "POST",
    body: JSON.stringify({ sportId, plan, method }),
  });
}

export async function apiGetAdminUsers() {
  const data = await request("/api/admin/users");
  return data.users || [];
}

export async function apiGetAdminUserDetails(id) {
  return request(`/api/admin/users/${id}`);
}

export async function apiDeleteAdminUser(id) {
  return request(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}


