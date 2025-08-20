
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


export const endpoints = {
  login: () => `${API_BASE_URL}/api/token/`,
  refresh: () => `${API_BASE_URL}/api/token/refresh/`,
  blacklist: () => `${API_BASE_URL}/api/token/blacklist/`,
  workorder: () => `${API_BASE_URL}/main/workorder/`,
  serialnumber: () => `${API_BASE_URL}/main/serialnumber/`,
  projectmaster: () => `${API_BASE_URL}/main/projectmaster/`
};
