// routes
const express = require('express');
const router = express.Router();
const { generateMealPlan} = require('../Controllers/mealPlanController');

// Generate meal plan route
router.post('/generate', generateMealPlan);

module.exports = router;
