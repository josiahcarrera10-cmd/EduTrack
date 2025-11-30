// app/lib/axios.js

import axios from "axios";

// ❗ Prevent SSR crash: only import AsyncStorage on client
let AsyncStorage = null;
if (typeof window !== "undefined") {
  // dynamic import avoids Vercel SSR errors
  const mod = await import("@react-native-async-storage/async-storage");
  AsyncStorage = mod.default;
}

// Use the Vercel environment variable + append /api
export const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Attach token automatically (SSR-safe)
api.interceptors.request.use(async (config) => {
  try {
    // ⛔ If running on server, or AsyncStorage not loaded → skip
    if (typeof window === "undefined" || !AsyncStorage) {
      return config;
    }

    const role = await AsyncStorage.getItem("role");
    const token = role
      ? await AsyncStorage.getItem(`${role}Token`)
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("❌ Axios interceptor error:", err.message);
  }

  return config;
});

export default api;
