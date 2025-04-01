// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes'; // Adjust to your backend URL

// Interceptor to add authorization token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const recipeService = {
  getAllRecipes: async (page = 1, limit = 10, search = '', filters = {}) => {
    const { dietType, tags } = filters;
    const response = await axios.get(API_URL, {
      params: { page, limit, search, dietType, tags }
    });
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  toggleFavorite: async (recipeId) => {
    const response = await axios.post(`${API_URL}/${recipeId}/favorite`);
    return response.data;
  },

  getUserFavorites: async () => {
    const response = await axios.get(`${API_URL}/favorites/my`);
    return response.data;
  },

  searchRecipes: async (search, filters = {}) => {
    const { page = 1, limit = 10, dietType, tags } = filters;
    const response = await axios.get(`${API_URL}/search`, {
      params: { search, page, limit, dietType, tags }
    });
    return response.data;
  }
};
