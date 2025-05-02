import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const MealPlannerPage = () => {
  const [formData, setFormData] = useState({
    dietType: 'balanced',
    restrictions: '',
    calories: '',
    days: 7,
    meals: 3
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean restrictions input
  const cleanedFormData = {
    ...formData,
    restrictions: formData.restrictions.replace(/[^a-zA-Z, ]/g, '').trim()
  };
  
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(`${API_BASE_URL}/meal-plans/generate`, cleanedFormData);
      
      if (!response.data || !response.data.mealPlan) {
        throw new Error('Invalid response format');
      }
      
      setMealPlan(response.data.mealPlan);
    } catch (err) {
      console.error('Error generating meal plan:', err);
      
      // Get a more specific error message if available
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           'Failed to generate meal plan. Please try again.';
      
      setError(errorMessage);
      
      // Store debug information if available
      if (err.response?.data?.debug) {
        setDebugInfo(err.response.data.debug);
        console.log("Debug info:", err.response.data.debug);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Meal Planner</h1>
      <p className="mb-6 text-gray-600">Generate a custom meal plan based on your dietary preferences and requirements using AI.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Diet Type
              </label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="low-carb">Low Carb</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Dietary Restrictions/Allergies
              </label>
              <input
                type="text"
                name="restrictions"
                value={formData.restrictions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., gluten, peanuts, dairy"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Target Daily Calories
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 2000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Number of Days
                </label>
                <select
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value={3}>3 days</option>
                  <option value={5}>5 days</option>
                  <option value={7}>7 days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Meals per Day
                </label>
                <select
                  name="meals"
                  value={formData.meals}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value={3}>3 meals</option>
                  <option value={4}>4 meals (with snack)</option>
                  <option value={5}>5 meals (with snacks)</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Generating Plan...
                </span>
              ) : (
                'Generate Meal Plan'
              )}
            </button>
          </form>
        </div>
        
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              
              {debugInfo && (
                <div className="mt-4 text-sm">
                  <p className="font-bold">Debug Information:</p>
                  <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-60">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="mt-4">
                <p className="font-semibold">Troubleshooting Tips:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Check if there are recipes in the database</li>
                  <li>Try with fewer dietary restrictions</li>
                  <li>Make sure your calorie target is reasonable (e.g., 1500-2500)</li>
                  <li>Try a different diet type</li>
                </ul>
              </div>
            </div>
          ) : mealPlan ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Your {formData.days}-Day Meal Plan</h2>
              {renderMealPlan(mealPlan)}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">Fill out the form to generate your personalized meal plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderMealPlan = (mealPlan) => {
  return (
    <div className="space-y-6">
      {mealPlan.days.map((day, index) => (
        <div key={index} className="border-b pb-4 last:border-b-0">
          <h3 className="text-xl font-medium mb-3">{day.day}</h3>
          <div className="space-y-3">
            {day.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-blue-600">{meal.type}</h4>
                <p className="font-semibold">{meal.name}</p>
                {meal.ingredients && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Ingredients:</span> {meal.ingredients.join(', ')}
                  </p>
                )}
                {meal.calories && (
                  <p className="text-sm text-gray-600">Approx. {meal.calories} calories</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealPlannerPage;