// routes/userMealRoutes.js
const express = require('express');
const router = express.Router();
const {generateDailyUserMeals,getUserMeals,getRecipeDetails} = require('../Controllers/userMealController');
const authMiddleware = require('../Middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   POST /api/meals/generate
 * @desc    Generate daily meals for the authenticated user
 * @access  Private
 */
router.post('/generate', generateDailyUserMeals);

/**
 * @route   GET /api/meals/today
 * @desc    Get user meals for today
 * @access  Private
 */
router.get('/today', getUserMeals);

/**
 * @route   GET /api/meals/recipe/:recipeId
 * @desc    Get detailed recipe information for a specific meal
 * @access  Private
 */
router.get('/recipe/:recipeId', getRecipeDetails);

module.exports = router;