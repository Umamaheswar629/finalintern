import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img 
        src={recipe.imageUrl || '/placeholder-image.jpg'} 
        alt={recipe.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{recipe.dietType}</span>
          <span>{recipe.cookingTime} mins</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;