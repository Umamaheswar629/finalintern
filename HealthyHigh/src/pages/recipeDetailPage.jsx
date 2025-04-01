import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import RecipeCard from '../components/recipeCard';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (!id) {
            console.error("Recipe ID is undefined.");
            setError("Recipe ID is missing.");
            setLoading(false);
            return;
        }
        console.log("Full URL to fetch:", `${API_BASE_URL}/recipes/${id}`);

        const fetchRecipeDetails = async () => {
            try {
                console.log(`Fetching recipe with ID: ${id}`);
                console.log(`Full URL: ${API_BASE_URL}/recipes/${id}`);

                const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);

                console.log("Received recipe data:", response.data);

                if (!response.data) {
                    throw new Error("No recipe data returned");
                }

                setRecipe(response.data);
                console.log("Fetched Recipe Data:", response.data);
                setLoading(false);
            } catch (error) {
                console.error("Detailed error fetching recipe details:", error);
                console.error("Error response:", error.response);

                setError(error.response?.data?.message || "Failed to load recipe");
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id, navigate]);

    const toggleFavorite = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/recipes/${id}/favorite`);
            setIsFavorite(response.data.isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading recipe details...</div>;
    }

    if (error) {
        return <div className="text-center py-10">{error}</div>;
    }

    if (!recipe) {
        return <div className="text-center py-10">Recipe not found</div>;
    }

    console.log("Recipe data for rendering:", recipe);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Recipe Image */}
                <div>
                    <img
                        src={recipe.image || '/placeholder-image.jpg'}
                        alt={recipe.title}
                        className="w-full h-96 object-cover rounded-lg"
                    />
                </div>

                {/* Recipe Details */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">{recipe.title}</h1>
                        <button
                            onClick={toggleFavorite}
                            className="text-red-500 hover:text-red-700"
                        >
                            <HeartIcon
                                fill={isFavorite ? 'currentColor' : 'none'}
                                className="w-8 h-8"
                            />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-600">{recipe.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <strong>Diet Type</strong>
                            <p>{recipe.dietType.join(', ')}</p>
                        </div>
                        <div>
                            <strong>Calories</strong>
                            <p>{recipe.calories} cal</p>
                        </div>
                        <div>
                            <strong>Cooking Time</strong>
                            <p>{recipe.cookingTime} mins</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                        <ul className="list-disc list-inside">
                        {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient._id}>{ingredient.name} - {ingredient.quantity}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                        <ol className="list-decimal list-inside">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="mb-2">{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;