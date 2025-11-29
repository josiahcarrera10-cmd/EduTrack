// app/lib/axios.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Use the Vercel environment variable + append /api
export const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Attach token automatically (web-safe, SSR-safe)
api.interceptors.request.use(async (config) => {
  try {
    // Prevent AsyncStorage from running on the server (SSR)
    if (typeof window === "undefined") {
      return config; // running on server → skip token logic
    }

    const role = await AsyncStorage.getItem("role");
    const token = role ? await AsyncStorage.getItem(`${role}Token`) : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("❌ Axios interceptor error:", err.message);
  }

  return config;
});

export default api;
