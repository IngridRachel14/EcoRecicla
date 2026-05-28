// utils/authFetch.js

const BASE_URL = "https://api.sakuraocean.app";

export default async function authFetch(endpoint, token, options = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
