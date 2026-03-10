// Production: пустой VITE_API_BASE_URL → запросы /api/* на тот же хост (tacticode.ru).
// Dev (npm run dev): по умолчанию http://localhost:4000.
const raw = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL =
  raw !== undefined && String(raw).trim() !== ""
    ? String(raw).trim()
    : (import.meta.env.DEV ? "http://localhost:4000" : "");

function getToken() {
  return localStorage.getItem("accessToken") || null;
}

function setToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
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
    throw new Error(message);
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

export async function apiPasswordRequestReset({ email }) {
  return request("/api/auth/password/request-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
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

export async function apiGetMe() {
  const data = await request("/api/auth/me");
  return data.user;
}

export function apiLogout() {
  setToken(null);
}

export async function apiUpdateMe({ login, email }) {
  const data = await request("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ login, email }),
  });
  return data.user;
}

export async function apiRegisterDevice({ deviceName, deviceType }) {
  const data = await request("/api/devices/register", {
    method: "POST",
    body: JSON.stringify({
      device_name: deviceName,
      device_type: deviceType,
    }),
  });
  return data.device;
}

export async function apiGetDevices() {
  const data = await request("/api/devices");
  return data.devices;
}

export async function apiDeleteDevice(id) {
  await request(`/api/devices/${id}`, {
    method: "DELETE",
  });
}

export async function apiGetSubscriptions() {
  const data = await request("/api/subscriptions");
  return data.subscriptions || [];
}

export async function apiActivateSubscription({ sportId, plan, method }) {
  const data = await request("/api/subscriptions/activate", {
    method: "POST",
    body: JSON.stringify({ sportId, plan, method }),
  });
  return data.subscriptions || [];
}


