// Controllers/mealPlanController.js
const MealPlan = require("../Models/MealPlan");
const User = require("../Models/User");
const { generateMealPlan, generateWeeklyMealPlan } = require("../utils/mealPlanGenerator.js");

// Generate meal plan for a day
exports.createDailyMealPlan = async (req, res) => {
  try {
    const { date } = req.body;
    const planDate = date ? new Date(date) : new Date();
    
    // Check if plan already exists for this date
    const existingPlan = await MealPlan.findOne({
      user: req.user.id,
      date: {
        $gte: new Date(planDate.setHours(0, 0, 0, 0)),
        $lt: new Date(planDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (existingPlan) {
      return res.status(400).json({ 
        message: "Meal plan already exists for this date",
        plan: existingPlan
      });
    }
    
    // Generate new meal plan
    const mealPlan = await generateMealPlan(req.user.id, planDate);
    
    // Return populated meal plan with recipe details
    const populatedPlan = await MealPlan.findById(mealPlan._id)
      .populate({
        path: 'meals.recipe',
        select: 'name calories macronutrients instructions'
      });
    
    res.status(201).json(populatedPlan);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Generate meal plans for a week
exports.createWeeklyMealPlan = async (req, res) => {
  try {
    const { startDate } = req.body;
    const weekStart = startDate ? new Date(startDate) : new Date();
    
    // Generate meal plans for the week
    const weeklyPlans = await generateWeeklyMealPlan(req.user.id, weekStart);
    
    // Get populated plans
    const planIds = weeklyPlans.map(plan => plan._id);
    const populatedPlans = await MealPlan.find({
      _id: { $in: planIds }
    }).populate({
      path: 'meals.recipe',
      select: 'name calories macronutrients instructions'
    });
    
    res.status(201).json(populatedPlans);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get meal plan by date
exports.getMealPlanByDate = async (req, res) => {
  try {
    const planDate = new Date(req.params.date);
    
    const mealPlan = await MealPlan.findOne({
      user: req.user.id,
      date: {
        $gte: new Date(planDate.setHours(0, 0, 0, 0)),
        $lt: new Date(planDate.setHours(23, 59, 59, 999))
      }
    }).populate({
      path: 'meals.recipe',
      select: 'name calories macronutrients instructions'
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found for this date" });
    }
    
    res.json(mealPlan);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update meal plan (replace specific meal)
exports.updateMeal = async (req, res) => {
  try {
    const { mealId, recipeId } = req.body;
    
    const mealPlan = await MealPlan.findOne({
      user: req.user.id,
      "meals._id": mealId
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan or meal not found" });
    }
    
    // Update the specific meal
    const mealIndex = mealPlan.meals.findIndex(meal => meal._id.toString() === mealId);
    if (mealIndex === -1) {
      return res.status(404).json({ message: "Meal not found in plan" });
    }
    
    mealPlan.meals[mealIndex].recipe = recipeId;
    await mealPlan.save();
    
    // Return updated plan
    const updatedPlan = await MealPlan.findById(mealPlan._id)
      .populate({
        path: 'meals.recipe',
        select: 'name calories macronutrients instructions'
      });
    
    res.json(updatedPlan);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    res.json({ message: "Meal plan removed" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};