// APIs/recipeRoutes.js
const express = require("express");
const { 
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  toggleFavorite,
  getUserFavoriteRecipes
} = require("../Controllers/recipeController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.get('/search', searchRecipes);


// Protected routes
router.post('/:id/favorite', authMiddleware, toggleFavorite);
router.get('/favorites/my', authMiddleware, getUserFavoriteRecipes);



module.exports = router;