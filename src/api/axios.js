import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// ฟังก์ชันช่วยเรียก refresh token API
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem('access', response.data.access);
    return response.data.access;
  } catch (error) {
    // refresh token หมดอายุหรือไม่ถูกต้อง
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    throw error;
  }
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor ตรวจจับ response error 401 และลอง refresh token
api.interceptors.response.use(
  response => response, // ปกติให้ผ่านเลย
  async error => {
    const originalRequest = error.config;

    // เช็ค error 401 (Unauthorized) และไม่ใช่ request refresh token เอง (ป้องกัน loop)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // กำหนด flag เพื่อไม่ให้ retry ซ้ำ

      try {
        const newAccessToken = await refreshAccessToken();

        // อัพเดต header ด้วย token ใหม่ แล้ว retry request เดิม
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // ถ้า refresh ไม่สำเร็จ อาจจะ logout หรือแจ้งผู้ใช้
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
