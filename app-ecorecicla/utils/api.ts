import { useAuthSession } from "@/providers/AuthProvider";

export function useApi() {
  const { token } = useAuthSession();

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token?.current}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error en la API');
    }

    return res.json();
  };

  return { apiFetch };
}
