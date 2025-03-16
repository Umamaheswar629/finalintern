// Controllers/recipeController.js
const Recipe = require("../Models/Recipe");
const Food = require("../Models/Food");
const { getRecommendedRecipes } = require("../utils/recipeRecommender.js");

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('ingredients.food', 'name calories macronutrients');
    
    res.json(recipes);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('ingredients.food', 'name calories macronutrients');
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create new recipe
exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  
  try {
    // Validate ingredients
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Recipe must have at least one ingredient" });
    }
    
    // Fetch all foods to calculate nutritional values
    const foodIds = ingredients.map(item => item.food);
    const foods = await Food.find({ _id: { $in: foodIds } });
    
    if (foods.length !== foodIds.length) {
      return res.status(400).json({ message: "Some food items not found" });
    }
    
    // Calculate total calories and macronutrients
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    ingredients.forEach(ingredient => {
      const food = foods.find(f => f._id.toString() === ingredient.food.toString());
      if (food) {
        // Scale based on quantity
        const ratio = ingredient.quantity / 100; // Assuming base is 100g
        totalCalories += food.calories * ratio;
        totalProtein += food.macronutrients.protein * ratio;
        totalCarbs += food.macronutrients.carbs * ratio;
        totalFats += food.macronutrients.fats * ratio;
      }
    });
    
    // Create new recipe
    const newRecipe = new Recipe({
      name,
      ingredients,
      instructions,
      calories: Math.round(totalCalories),
      macronutrients: {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fats: Math.round(totalFats)
      }
    });
    
    const recipe = await newRecipe.save();
    
    // Return populated recipe
    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('ingredients.food', 'name calories macronutrients');
    
    res.status(201).json(populatedRecipe);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  
  try {
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    // If ingredients are updated, recalculate nutritional values
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      // Fetch all foods to calculate nutritional values
      const foodIds = ingredients.map(item => item.food);
      const foods = await Food.find({ _id: { $in: foodIds } });
      
      if (foods.length !== foodIds.length) {
        return res.status(400).json({ message: "Some food items not found" });
      }
      
      // Calculate total calories and macronutrients
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      
      ingredients.forEach(ingredient => {
        const food = foods.find(f => f._id.toString() === ingredient.food.toString());
        if (food) {
          // Scale based on quantity
          const ratio = ingredient.quantity / 100; // Assuming base is 100g
          totalCalories += food.calories * ratio;
          totalProtein += food.macronutrients.protein * ratio;
          totalCarbs += food.macronutrients.carbs * ratio;
          totalFats += food.macronutrients.fats * ratio;
        }
      });
      
      // Update recipe with new values
      recipe.ingredients = ingredients;
      recipe.calories = Math.round(totalCalories);
      recipe.macronutrients = {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fats: Math.round(totalFats)
      };
    }
    
    // Update other fields if provided
    if (name) recipe.name = name;
    if (instructions) recipe.instructions = instructions;
    
    await recipe.save();
    
    // Return populated recipe
    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('ingredients.food', 'name calories macronutrients');
    
    res.json(populatedRecipe);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    res.json({ message: "Recipe removed" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get recommended recipes for user
exports.getRecommendedRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await getRecommendedRecipes(req.user.id, limit);
    
    res.json(recommendations);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Search recipes by name or ingredient
exports.searchRecipes = async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }
  
  try {
    // Search by recipe name
    const recipesByName = await Recipe.find({
      name: { $regex: query, $options: 'i' }
    }).populate('ingredients.food', 'name');
    
    // Search by ingredient name using aggregation
    const recipesByIngredient = await Recipe.aggregate([
      {
        $lookup: {
          from: "foods",
          localField: "ingredients.food",
          foreignField: "_id",
          as: "ingredientDetails"
        }
      },
      {
        $match: {
          "ingredientDetails.name": { $regex: query, $options: 'i' }
        }
      }
    ]);
    
    // Combine results, remove duplicates
    const recipeIds = new Set();
    const combinedResults = [];
    
    // Add recipes found by name
    recipesByName.forEach(recipe => {
      recipeIds.add(recipe._id.toString());
      combinedResults.push(recipe);
    });
    
    // Add recipes found by ingredient (if not already added)
    recipesByIngredient.forEach(recipe => {
      if (!recipeIds.has(recipe._id.toString())) {
        recipeIds.add(recipe._id.toString());
        combinedResults.push(recipe);
      }
    });
    
    res.json(combinedResults);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Filter recipes by criteria
exports.filterRecipes = async (req, res) => {
  const { 
    minCalories, 
    maxCalories, 
    minProtein, 
    maxProtein,
    minCarbs,
    maxCarbs,
    minFats,
    maxFats,
    ingredients
  } = req.query;
  
  try {
    // Build filter object
    const filter = {};
    
    // Calorie range
    if (minCalories !== undefined || maxCalories !== undefined) {
      filter.calories = {};
      if (minCalories !== undefined) filter.calories.$gte = parseInt(minCalories);
      if (maxCalories !== undefined) filter.calories.$lte = parseInt(maxCalories);
    }
    
    // Protein range
    if (minProtein !== undefined || maxProtein !== undefined) {
      filter["macronutrients.protein"] = {};
      if (minProtein !== undefined) filter["macronutrients.protein"].$gte = parseInt(minProtein);
      if (maxProtein !== undefined) filter["macronutrients.protein"].$lte = parseInt(maxProtein);
    }
    
    // Carbs range
    if (minCarbs !== undefined || maxCarbs !== undefined) {
      filter["macronutrients.carbs"] = {};
      if (minCarbs !== undefined) filter["macronutrients.carbs"].$gte = parseInt(minCarbs);
      if (maxCarbs !== undefined) filter["macronutrients.carbs"].$lte = parseInt(maxCarbs);
    }
    
    // Fats range
    if (minFats !== undefined || maxFats !== undefined) {
      filter["macronutrients.fats"] = {};
      if (minFats !== undefined) filter["macronutrients.fats"].$gte = parseInt(minFats);
      if (maxFats !== undefined) filter["macronutrients.fats"].$lte = parseInt(maxFats);
    }
    
    // Filter by ingredients (requires ingredients to be present)
    if (ingredients) {
      const ingredientList = ingredients.split(',');
      filter["ingredients.food"] = { $all: ingredientList };
    }
    
    const recipes = await Recipe.find(filter)
      .populate('ingredients.food', 'name calories macronutrients');
    
    res.json(recipes);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};