// app/lib/axios.js
import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    // ❗ SSR: skip
    if (typeof window === "undefined") {
      return config;
    }

    // ❗ Dynamically import AsyncStorage ONLY on client
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );

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
