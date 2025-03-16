const Recipe = require("../Models/Recipe");
const User = require("../Models/User");

exports.getRecommendedRecipes = async (userId, limit = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // ✅ Build query based on user preferences
    let query = {};

    // ✅ Exclude recipes containing allergens
    if (user.allergens && user.allergens.length > 0) {
      query["allergens"] = { $not: { $elemMatch: { $in: user.allergens } } };
    }

    // ✅ Ensure all dietary preferences are strictly matched
    if (user.dietaryPreferences && user.dietaryPreferences.length > 0) {
      query["tags"] = { $all: user.dietaryPreferences }; 
    }

    console.log("Query applied:", JSON.stringify(query, null, 2));

    // Fetch user's previous interactions (likes, views)
    const userInteractions = user.likedRecipes || [];

    // ✅ Step 1: Try to fetch recipes that fully match criteria
    let recipes = await Recipe.find(query).limit(limit * 2);

    console.log("Filtered recipes count:", recipes.length);

    // ✅ Step 2: If no recipes match, fallback to dietary-matching recipes (without allergen filter)
    if (recipes.length < limit) {
      let dietQuery = {};
      if (user.dietaryPreferences && user.dietaryPreferences.length > 0) {
        dietQuery["tags"] = { $all: user.dietaryPreferences };
      }

      const additionalRecipes = await Recipe.find(dietQuery).limit(limit - recipes.length);
      console.log("Dietary fallback recipes count:", additionalRecipes.length);
      recipes = [...recipes, ...additionalRecipes];
    }

    // ✅ Step 3: Final fallback (only return general recipes if NO preference matches are found)
    if (recipes.length === 0) {
      recipes = await Recipe.find().limit(limit);
      console.log("Final fallback: Returning all recipes", recipes.length);
    }

    // Score recipes using a weighted ranking system
    recipes = recipes.map(recipe => {
      let score = 0;

      // ✅ Give weight to dietary preference matches
      const matchCount = (user.dietaryPreferences || []).filter(pref => 
        recipe.tags && recipe.tags.includes(pref)
      ).length;
      score += matchCount * 2;

      // ✅ Adjust based on fitness goals (favor higher/lower calorie recipes)
      if (user.goal === "Lose Weight") {
        score -= recipe.calories / 100;
      } else if (user.goal === "Gain Weight") {
        score += recipe.calories / 100;
      }

      // ✅ Boost score if the user has interacted with this recipe before
      if (userInteractions.includes(recipe._id.toString())) {
        score += 5;
      }

      return { recipe, score };
    });

    // ✅ Sort recipes by score (higher is better)
    recipes.sort((a, b) => b.score - a.score || Math.random() - 0.5);

    console.log("Final recommended recipes:", recipes.slice(0, limit));

    // ✅ Return only the top `limit` recipes
    return recipes.slice(0, limit).map(r => r.recipe);
  } catch (error) {
    console.error("Error getting recipe recommendations:", error);
    throw error;
  }
};
