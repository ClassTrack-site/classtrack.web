import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Interceptor para inyectar token JWT y cabeceras de tenant si aplican
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('classtrack_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cabecera opcional para Super Administrador que inspecciona un colegio específico
    const overrideSchoolSlug = localStorage.getItem('classtrack_override_slug');
    if (overrideSchoolSlug && config.headers) {
      config.headers['x-school-slug'] = overrideSchoolSlug;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta para manejo centralizado de 401 y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión local y redirigir al login si el token caducó
      const isAuthRoute = window.location.pathname.startsWith('/login') ||
                          window.location.pathname.startsWith('/activate') ||
                          window.location.pathname.startsWith('/forgot-password');
      if (!isAuthRoute) {
        localStorage.removeItem('classtrack_token');
        localStorage.removeItem('classtrack_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
