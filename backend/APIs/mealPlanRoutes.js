// APIs/mealPlanRoutes.js
const express = require("express");
const { 
  createDailyMealPlan,
  createWeeklyMealPlan,
  getMealPlanByDate,
  updateMeal,
  deleteMealPlan
} = require("../Controllers/mealPlanController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Generate meal plans
router.post("/daily", createDailyMealPlan);
router.post("/weekly", createWeeklyMealPlan);

// Get meal plan by date
router.get("/date/:date", getMealPlanByDate);

// Update specific meal in a plan
router.put("/meal", updateMeal);

// Delete meal plan
router.delete("/:id", deleteMealPlan);

module.exports = router;