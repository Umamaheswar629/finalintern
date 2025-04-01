import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/recipeCard';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DiscoverPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: '',
    dietType: '',
    tags: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, [page, filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/recipes/`, {
        params: {
          page,
          limit: 10,
          search: filters.search,
          dietType: filters.dietType,
          tags: filters.tags
        }
      });
      
      setRecipes(response.data.recipes);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleRecipeClick = (id) => {
    console.log('Clicked Recipe ID:', id);
    
  navigate(`/recipes/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div className="text-center py-10">Loading recipes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          name="search"
          placeholder="Search recipes..."
          value={filters.search}
          onChange={handleFilterChange}
          className="flex-grow p-2 border rounded"
        />
        <select
          name="dietType"
          value={filters.dietType}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Diet Types</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div 
            key={recipe._id} 
            onClick={() => {
              console.log('Recipe clicked:', recipe._id);
              handleRecipeClick(recipe._id);
            }}
            className="cursor-pointer"
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-4 py-2 rounded ${
              page === pageNum 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPage;