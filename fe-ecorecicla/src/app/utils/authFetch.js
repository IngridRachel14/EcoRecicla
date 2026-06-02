// utils/authFetch.js

const BASE_URL = "http://67.205.137.87:3000";

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
