// Utils/mealPlanGenerator.js
const Recipe = require("../Models/Recipe");
const Food = require("../Models/Food");
const NutritionalRequirement = require("../Models/NutritionalRequirement");
const MealPlan = require("../Models/MealPlan");
const mongoose = require("mongoose");

/**
 * Meal Plan Generator with ML-based recommendation
 * This algorithm uses collaborative filtering and content-based filtering techniques
 * to generate personalized meal plans based on user preferences and nutritional needs
 */

// Feature extraction for content-based filtering
const extractRecipeFeatures = (recipe, userPreferences) => {
  // Extract key features from a recipe that can be used for similarity calculations
  const features = {
    // Nutritional features (normalized)
    proteinRatio: recipe.macronutrients.protein / recipe.calories * 1000,
    carbsRatio: recipe.macronutrients.carbs / recipe.calories * 1000,
    fatsRatio: recipe.macronutrients.fats / recipe.calories * 1000,
    
    // Category features - we would extract these from recipe ingredients
    // This is simplified for demonstration purposes
    hasPreferredIngredients: 0,
    hasAllergicIngredients: 0
  };
  
  // Check if recipe contains preferred ingredients or categories
  if (userPreferences && userPreferences.dietaryPreferences) {
    features.hasPreferredIngredients = userPreferences.dietaryPreferences.some(
      pref => recipe.tags && recipe.tags.includes(pref)
    ) ? 1 : 0;
  }
  
  // Check if recipe contains allergens
  if (userPreferences && userPreferences.allergens) {
    features.hasAllergicIngredients = userPreferences.allergens.some(
      allergen => recipe.allergens && recipe.allergens.includes(allergen)
    ) ? 1 : 0;
  }
  
  return features;
};

// Calculate similarity between recipes based on features
const calculateSimilarity = (recipe1Features, recipe2Features) => {
  // Compute cosine similarity between feature vectors
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (const key in recipe1Features) {
    if (key === 'hasAllergicIngredients') continue; // Skip allergens for similarity
    
    dotProduct += recipe1Features[key] * recipe2Features[key];
    normA += Math.pow(recipe1Features[key], 2);
    normB += Math.pow(recipe2Features[key], 2);
  }
  
  // If either vector is zero, similarity is 0
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Get recipe recommendations based on content similarity
const getRecommendedRecipes = async (user, previouslyLikedRecipes = [], count = 20) => {
  // Get all available recipes
  const allRecipes = await Recipe.find();
  
  // If we don't have any previously liked recipes, return random selections
  if (!previouslyLikedRecipes.length) {
    // Filter recipes to remove any with user's allergens
    const safeRecipes = allRecipes.filter(recipe => 
      !user.allergens.some(allergen => 
        recipe.allergens && recipe.allergens.includes(allergen)
      )
    );
    
    // Return random selection of safe recipes
    return shuffleArray(safeRecipes).slice(0, count);
  }
  
  // Get features for previously liked recipes
  const likedRecipeFeatures = previouslyLikedRecipes.map(recipe => 
    extractRecipeFeatures(recipe, user)
  );
  
  // Calculate similarity scores for all recipes
  const recipesWithScores = allRecipes.map(recipe => {
    const recipeFeatures = extractRecipeFeatures(recipe, user);
    
    // Skip recipes with allergens
    if (user.allergens.some(allergen => 
      recipe.allergens && recipe.allergens.includes(allergen)
    )) {
      return { recipe, score: -1 }; // Mark as not recommended
    }
    
    // Calculate average similarity to liked recipes
    let totalSimilarity = 0;
    likedRecipeFeatures.forEach(likedFeatures => {
      totalSimilarity += calculateSimilarity(recipeFeatures, likedFeatures);
    });
    
    const avgSimilarity = totalSimilarity / likedRecipeFeatures.length;
    return { recipe, score: avgSimilarity };
  });
  
  // Sort by score and return top recommendations
  return recipesWithScores
    .filter(item => item.score > 0) // Remove allergen-containing recipes
    .sort((a, b) => b.score - a.score) // Sort by highest score first
    .slice(0, count) // Take top count
    .map(item => item.recipe); // Return just the recipes
};

// Function to distribute calories across meal types
const distributeMealCalories = (calorieTarget, userPreferences) => {
  // Default distribution if no preferences
  const defaultDistribution = {
    Breakfast: 0.25,
    Lunch: 0.3,
    Dinner: 0.35,
    Snack: 0.1
  };
  
  // Use user preferences if available, otherwise default
  const distribution = userPreferences?.mealDistribution || defaultDistribution;
  
  // Calculate calories per meal type
  return {
    Breakfast: Math.round(calorieTarget * distribution.Breakfast),
    Lunch: Math.round(calorieTarget * distribution.Lunch),
    Dinner: Math.round(calorieTarget * distribution.Dinner),
    Snack: Math.round(calorieTarget * distribution.Snack)
  };
};

// Find best recipe combinations to meet calorie and macro targets
const optimizeMealSelection = async (
  recipes, 
  calorieTarget, 
  macroTarget, 
  mealType,
  previousSelections = []
) => {
  // Filter appropriate recipes for the meal type
  const mealTypeRecipes = recipes.filter(recipe => 
    recipe.mealTypes && recipe.mealTypes.includes(mealType)
  );
  
  if (mealTypeRecipes.length === 0) {
    // Fallback: use any recipe if no specific meal type recipes available
    mealTypeRecipes = recipes;
  }
  
  // Avoid recently selected recipes to increase variety
  const freshOptions = mealTypeRecipes.filter(recipe => 
    !previousSelections.some(prev => prev.equals(recipe._id))
  );
  
  // If we have enough fresh options, use those; otherwise use all
  const recipeCandidates = freshOptions.length >= 5 ? freshOptions : mealTypeRecipes;
  
  // Calculate fitness score for each recipe based on:
  // 1. How close it is to calorie target
  // 2. How well it matches macro ratio
  const scoredRecipes = recipeCandidates.map(recipe => {
    // Calorie score - how close to target (0 to 1, with 1 being exact match)
    const calorieScore = 1 - Math.min(
      Math.abs(recipe.calories - calorieTarget) / calorieTarget, 
      1
    );
    
    // Macro score - how well macros match target ratio
    const proteinScore = 1 - Math.min(
      Math.abs(recipe.macronutrients.protein - macroTarget.protein) / macroTarget.protein,
      1
    );
    
    const carbsScore = 1 - Math.min(
      Math.abs(recipe.macronutrients.carbs - macroTarget.carbs) / macroTarget.carbs,
      1
    );
    
    const fatScore = 1 - Math.min(
      Math.abs(recipe.macronutrients.fats - macroTarget.fats) / macroTarget.fats,
      1
    );
    
    const macroScore = (proteinScore + carbsScore + fatScore) / 3;
    
    // Overall score (weighted)
    const overallScore = calorieScore * 0.6 + macroScore * 0.4;
    
    return { recipe, score: overallScore };
  });
  
  // Sort by score and return top recommendation
  scoredRecipes.sort((a, b) => b.score - a.score);
  
  // Return the best matching recipe
  return scoredRecipes[0]?.recipe || null;
};

// Helper function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate meal plan for a specific date
 */
exports.generateMealPlan = async (userId, date = new Date()) => {
  try {
    // Get user's nutritional requirements
    const user = await User.findById(userId);
    const nutritionalReq = await NutritionalRequirement.findOne({ user: userId });
    
    if (!nutritionalReq) {
      throw new Error("Nutritional requirements not found for user");
    }
    
    // Get previously liked recipes for recommendations
    // This would require a user ratings system
    const previouslyLikedRecipes = []; // Placeholder - implement actual liked recipes
    
    // Get recipe recommendations
    const recommendedRecipes = await getRecommendedRecipes(user, previouslyLikedRecipes);
    
    // Distribute calories across meal types
    const mealCalories = distributeMealCalories(nutritionalReq.calorieTarget, user.preferences);
    
    // Get previously used recipes (last 3 days) to avoid repetition
    const lastThreeDays = new Date(date);
    lastThreeDays.setDate(lastThreeDays.getDate() - 3);
    
    const recentMealPlans = await MealPlan.find({
      user: userId,
      date: { $gte: lastThreeDays, $lt: date }
    }).populate('meals.recipe');
    
    const recentRecipeIds = recentMealPlans
      .flatMap(plan => plan.meals)
      .map(meal => meal.recipe?._id)
      .filter(id => id); // Remove null/undefined
    
    // Create meal plan
    const meals = [];
    
    // For each meal type, select the best matching recipe
    for (const [mealType, calories] of Object.entries(mealCalories)) {
      // Scale macros based on meal calorie proportion
      const mealMacroTarget = {
        protein: Math.round(nutritionalReq.macronutrientRatio.protein * calories / nutritionalReq.calorieTarget),
        carbs: Math.round(nutritionalReq.macronutrientRatio.carbs * calories / nutritionalReq.calorieTarget),
        fats: Math.round(nutritionalReq.macronutrientRatio.fats * calories / nutritionalReq.calorieTarget)
      };
      
      // Optimize meal selection
      const selectedRecipe = await optimizeMealSelection(
        recommendedRecipes,
        calories,
        mealMacroTarget,
        mealType,
        recentRecipeIds
      );
      
      if (selectedRecipe) {
        meals.push({
          mealType,
          recipe: selectedRecipe._id
        });
      }
    }
    
    // Create and save the meal plan
    const mealPlan = new MealPlan({
      user: userId,
      date,
      meals
    });
    
    await mealPlan.save();
    return mealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

/**
 * Generate meal plans for a week
 */
exports.generateWeeklyMealPlan = async (userId, startDate = new Date()) => {
  const weeklyPlans = [];
  const currentDate = new Date(startDate);
  
  // Generate meal plans for 7 days
  for (let i = 0; i < 7; i++) {
    const dailyPlan = await exports.generateMealPlan(userId, new Date(currentDate));
    weeklyPlans.push(dailyPlan);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weeklyPlans;
};