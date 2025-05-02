// API service functions for DashboardPage.jsx
import axios from 'axios';

// Base URL setup
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper for authenticated requests
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// API services
export const fetchMeals = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.get(`${API_BASE_URL}/meals?date=${formattedDate}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No meals found for this date, return empty array
      return [];
    }
    throw error;
  }
};

export const fetchNutritionSummary = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    // Updated path to match the backend route exactly
    const response = await axios.get(`${API_BASE_URL}/meals/nutrition/summary?date=${formattedDate}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateMealPlan = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.post(`${API_BASE_URL}/meals/generate`, 
      { date: formattedDate },
      { headers: authHeader() }
    );
    // The backend returns { message, meals }, but we just want the meals
    return response.data.meals;
  } catch (error) {
    throw error;
  }
};

export const copyPreviousMealPlan = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.post(`${API_BASE_URL}/meals/copy-previous`, 
      { date: formattedDate },
      { headers: authHeader() }
    );
    // The backend returns { message, meals }, but we just want the meals
    return response.data.meals;
  } catch (error) {
    throw error;
  }
};

// Add functions for other API endpoints
export const getRecipeDetails = async (recipeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meals/recipe/${recipeId}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const likeRecipe = async (recipeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/meals/recipe/${recipeId}/like`, {}, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unlikeRecipe = async (recipeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/meals/recipe/${recipeId}/like`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};