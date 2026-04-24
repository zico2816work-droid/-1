async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "请求失败";
    const apiError = new Error(message);
    apiError.status = response.status;
    apiError.payload = payload;
    throw apiError;
  }

  return payload;
}

export function apiGet(url) {
  return request(url, { method: "GET" });
}

export function apiPost(url, body) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(body || {})
  });
}
