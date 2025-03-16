// APIs/recipeRoutes.js
const express = require("express");
const { 
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecommendedRecipes,
  searchRecipes,
  filterRecipes
} = require("../Controllers/recipeController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllRecipes);
router.get("/search", searchRecipes);
router.get("/filter", filterRecipes);
router.get("/:id", getRecipeById);

// Protected routes
router.post("/", authMiddleware, createRecipe);
router.put("/:id", authMiddleware, updateRecipe);
router.delete("/:id", authMiddleware, deleteRecipe);
router.get("/recommended/user", authMiddleware, getRecommendedRecipes);

module.exports = router;