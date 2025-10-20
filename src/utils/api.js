import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const jobAPI = {
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs${params ? `?${params}` : ''}`);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/jobs/recruiter/my-jobs');
    return response.data;
  },
};

export const applicationAPI = {
  createApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getApplicationsByJob: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
};

export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const profileAPI = {
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateMyProfile: async (profileData) => {
    const response = await api.put('/profile/me', profileData);
    return response.data;
  },

  getProfileByUserId: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },
};

export const statsAPI = {
  getDashboardStats: async () => {
    return {
      totalJobs: 0,
      totalApplications: 0,
      activeJobs: 0,
      pendingApplications: 0,
    };
  },
};

export const companyAPI = {
  getAllCompanies: async () => {
    return [];
  },
};

export default api;
