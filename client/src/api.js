const defaultApiBase = (() => {
  if (typeof window !== "undefined") {
    const { origin, port } = window.location;

    // Если фронтенд уже обслуживается бекендом (например, продакшн-сборка),
    // берём тот же origin, чтобы не ходить на 0.0.0.0/localhost вручную.
    if (port && port !== "3000") {
      return origin;
    }
  }

  // Локальная разработка CRA → бекенд на 8000.
  return "http://localhost:8000";
})();

const API_BASE = process.env.REACT_APP_API_BASE || defaultApiBase;

async function handleResponse(response) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = text;
    }
  }

  if (!response.ok) {
    const detail = data?.detail || data || response.statusText;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data;
}

export async function fetchCurrentPrice() {
  const response = await fetch(`${API_BASE}/price`);
  return handleResponse(response);
}

export async function createPayment({ description, returnUrl }) {
  const response = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, return_url: returnUrl }),
  });
  return handleResponse(response);
}

export function formatWindow(window) {
  if (!window) return "Обычная стоимость";
  const start = `${String(window.start_day).padStart(2, "0")}.${String(window.start_month).padStart(2, "0")}`;
  const end = `${String(window.end_day).padStart(2, "0")}.${String(window.end_month).padStart(2, "0")}`;
  return `${start} — ${end}`;
}

export function apiBaseUrl() {
  return API_BASE;
}
