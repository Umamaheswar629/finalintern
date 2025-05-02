// controllers/mealPlannerController.js
const axios = require('axios');
const Recipe = require('../Models/Recipe');

exports.generateMealPlan = async (req, res) => {
  try {
    const { dietType, restrictions, calories, days = 7, meals = 3 } = req.body;
    
    // API key should be stored in environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        message: 'API key for Gemini is not configured',
        error: 'GEMINI_API_KEY environment variable is missing'
      });
    }
    
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    // First, check if the Recipe model is accessible
    let recipeCount = 0;
    try {
      recipeCount = await Recipe.countDocuments();
      console.log(`Total recipes in database: ${recipeCount}`);
      
      if (recipeCount === 0) {
        return res.status(400).json({
          message: 'No recipes found in the database. Please add recipes before generating a meal plan.',
          error: 'Empty database'
        });
      }
    } catch (dbError) {
      console.error('Error connecting to database:', dbError);
      return res.status(500).json({
        message: 'Could not connect to the recipe database',
        error: dbError.message
      });
    }
    
    // Fetch relevant recipes from the database
    let relevantRecipes;
    let lastQuery = {}; // Define lastQuery at this scope level so it's available for error responses
    try {
      const result = await fetchRelevantRecipes(dietType, restrictions, calories);
      relevantRecipes = result.recipes;
      lastQuery = result.query;
      
      // Make sure relevantRecipes is an array even if the function failed
      if (!relevantRecipes || !Array.isArray(relevantRecipes)) {
        console.error("fetchRelevantRecipes did not return an array:", relevantRecipes);
        relevantRecipes = [];
      }
    } catch (error) {
      console.error("Error fetching relevant recipes:", error);
      relevantRecipes = [];
    }

    if (relevantRecipes.length === 0) {
      return res.status(400).json({ 
        message: 'No recipes found matching your criteria. Please add recipes or modify your requirements.',
        debug: {
          dietType,
          restrictions,
          calories,
          query: JSON.stringify(lastQuery || {}),
          totalRecipes: recipeCount
        }
      });
    }
    
    console.log(`Found ${relevantRecipes.length} relevant recipes for meal plan generation`);
    
    // Construct the prompt for Gemini with our database recipes
    const prompt = generateMealPlanPrompt(dietType, restrictions, calories, days, meals, relevantRecipes);
    
    // Call Gemini API
    let response;
    try {
      response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        }
      );
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      return res.status(500).json({
        message: 'Failed to generate meal plan using AI',
        error: apiError.message,
        apiErrorDetails: apiError.response?.data
      });
    }
    
    // Check if we have a valid response
    if (!response.data || !response.data.candidates || 
        !response.data.candidates[0] || !response.data.candidates[0].content || 
        !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0].text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    // Parse and structure the response
    const rawResponse = response.data.candidates[0].content.parts[0].text;
    const mealPlan = await parseMealPlanResponse(rawResponse, days, meals, relevantRecipes);
    
    // Validate meal plan before returning
    if (!mealPlan.days || mealPlan.days.length === 0) {
      throw new Error('Failed to parse meal plan data');
    }
    
    res.json({ mealPlan });
  } catch (error) {
    console.error('Meal Plan Generation Error:', error);
    console.error('Error details:', error.response?.data || 'No additional details');
    res.status(500).json({ 
      message: 'Error generating meal plan', 
      error: error.message 
    });
  }
};

// Fetch relevant recipes from database based on user preferences
async function fetchRelevantRecipes(dietType, restrictions, targetCalories) {
  const query = {}; // Define query outside the try block
  
  try {
    // Filter by diet type if specified
    if (dietType && dietType !== 'any') {
      query.dietType = dietType;
    }
    
    // Handle allergies and restrictions
    if (restrictions) {
      // Split restrictions into array if they're comma-separated
      const restrictionsList = restrictions.split(',').map(r => r.trim().toLowerCase());
      
      // Filter out empty strings
      const validRestrictions = restrictionsList.filter(r => r.length > 0);
      
      if (validRestrictions.length > 0) {
        // Create a $nin operator to exclude recipes with matching ingredients
        query['ingredients.name'] = { 
          $not: { 
            $in: validRestrictions
          } 
        };
      }
    }
    
    // Optional: Filter by calories if specified (with some flexibility)
    if (targetCalories && Number(targetCalories) > 0) {
      const calorieTarget = Number(targetCalories);
      // Allow for recipes within 30% of target per meal (assuming 3 meals per day)
      const mealTarget = calorieTarget / 3;
      const lowerBound = mealTarget * 0.7;
      const upperBound = mealTarget * 1.3;
      
      query.calories = { 
        $gte: lowerBound, 
        $lte: upperBound 
      };
    }
    
    // First, log the query for debugging
    console.log('Recipe query:', JSON.stringify(query));
    
    // Get a count of matching recipes
    const matchingCount = await Recipe.countDocuments(query);
    console.log(`Matching recipes before sort/limit: ${matchingCount}`);
    
    // If we have no matches with current filters, let's see if we can relax some
    if (matchingCount === 0) {
      // Try without calorie restriction first
      if (query.calories) {
        const withoutCaloriesQuery = { ...query };
        delete withoutCaloriesQuery.calories;
        
        const countWithoutCalories = await Recipe.countDocuments(withoutCaloriesQuery);
        console.log(`Matching recipes without calorie restriction: ${countWithoutCalories}`);
        
        // If removing calorie restriction helps, use that
        if (countWithoutCalories > 0) {
          console.log('Removing calorie restriction to find matching recipes');
          delete query.calories;
        }
      }
      
      // If still no matches and we have diet type, try without it
      if (await Recipe.countDocuments(query) === 0 && query.dietType) {
        const withoutDietQuery = { ...query };
        delete withoutDietQuery.dietType;
        
        const countWithoutDiet = await Recipe.countDocuments(withoutDietQuery);
        console.log(`Matching recipes without diet restriction: ${countWithoutDiet}`);
        
        // If removing diet restriction helps, use that
        if (countWithoutDiet > 0) {
          console.log('Removing diet restriction to find matching recipes');
          delete query.dietType;
        }
      }
    }
    
    // Fetch matching recipes with updated query, fix the sort criteria
    // FIXED: Don't sort on array fields which caused the parallel arrays error
    const recipes = await Recipe.find(query)
      .sort({ 
        calories: -1  // Only sort by calories, which is a scalar field
      })
      .limit(200);
    
    console.log(`Final query returned ${recipes.length} recipes`);
      
    // Return both the recipes and the query for debugging
    return {
      recipes,
      query
    };
  }
  catch (error) {
    console.error("Error in fetchRelevantRecipes:", error);
    // Return empty array instead of undefined in case of error
    return {
      recipes: [],
      query
    };
  }
}

// Helper function to generate the prompt with database recipes
function generateMealPlanPrompt(dietType, restrictions, calories, days, meals, recipes) {
  let calorieText = calories ? `with approximately ${calories} calories per day` : '';
  let restrictionsText = restrictions ? `I have the following dietary restrictions: ${restrictions}.` : '';
  
  // Format recipes for the prompt - limit to 50 recipes to avoid exceeding token limits
  const recipesToInclude = recipes.slice(0, 50);
  
  const recipeList = recipesToInclude.map(recipe => {
    const caloriesInfo = recipe.calories ? `${recipe.calories} calories` : 'calories not specified';
    const dietInfo = recipe.dietType ? `Diet: ${recipe.dietType}` : '';
    
    // Safely extract main ingredients
    let mainIngredients = 'Not specified';
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      const ingredientNames = recipe.ingredients
        .slice(0, 3)
        .map(i => typeof i === 'object' && i.name ? i.name : i)
        .filter(i => i)
        .join(', ');
      
      if (ingredientNames) {
        mainIngredients = ingredientNames;
      }
    }
    
    return `- ${recipe.title} (ID: ${recipe._id}): ${caloriesInfo}, ${dietInfo}. Main ingredients: ${mainIngredients}`;
  }).join('\n');
  
  return `Create a balanced ${days}-day meal plan for a ${dietType || 'general'} diet ${calorieText}. 
${restrictionsText}
I want ${meals} meals per day.

Use ONLY the following recipes from my database when creating the meal plan:
${recipeList}

Format your response exactly as follows:
Day 1:
- Breakfast: [Recipe Title] (ID: [Recipe ID])
- Lunch: [Recipe Title] (ID: [Recipe ID])
- Dinner: [Recipe Title] (ID: [Recipe ID])
${meals > 3 ? '- Snack: [Recipe Title] (ID: [Recipe ID])' : ''}
${meals > 4 ? '- Evening Snack: [Recipe Title] (ID: [Recipe ID])' : ''}

[Repeat for each day]

IMPORTANT RULES:
1. You MUST use the exact recipe titles and IDs from the list I provided.
2. Make sure each meal plan is varied, with different recipes each day.
3. Try to balance nutrition across the day.
4. Follow this EXACT format for each meal: [Meal Type]: [Recipe Title] (ID: [Recipe ID])
5. Do not invent new recipes or IDs.`;
}

// Helper function to parse the Gemini response into structured data
async function parseMealPlanResponse(rawResponse, daysCount, mealsPerDay, availableRecipes) {
  // Initialize the structured meal plan
  const mealPlan = {
    days: []
  };
  
  try {
    // Split the response by days
    const dayChunks = rawResponse.split(/Day \d+:/i);
    
    // Create a map of recipe IDs to recipe objects for quick lookup
    const recipeMap = new Map();
    availableRecipes.forEach(recipe => {
      recipeMap.set(recipe._id.toString(), recipe);
    });
    
    // Process each day chunk (skip first chunk which is usually empty or intro text)
    for (let i = 1; i < dayChunks.length && i <= daysCount; i++) {
      const dayText = dayChunks[i].trim();
      
      const day = {
        day: `Day ${i}`,
        meals: []
      };
      
      // Get all meal lines (lines starting with a dash)
      const mealLines = dayText.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'));
      
      // Process each meal line
      for (let j = 0; j < Math.min(mealsPerDay, mealLines.length); j++) {
        const mealLine = mealLines[j];
        
        // Try to extract structured data with regex
        // Match the format: "- [Meal Type]: [Recipe Title] (ID: [Recipe ID])"
        const structuredMatch = mealLine.match(/- ([^:]+):\s*([^(]+)\s*\(ID:\s*([^)]+)\)/i);
        
        if (structuredMatch) {
          const mealType = structuredMatch[1].trim();
          const recipeName = structuredMatch[2].trim();
          const recipeId = structuredMatch[3].trim();
          
          // Look up the recipe in our map
          const matchedRecipe = recipeMap.get(recipeId);
          
          if (matchedRecipe) {
            // Found the recipe in our database
            day.meals.push({
              type: mealType,
              name: matchedRecipe.title, // Use the actual title from the database
              recipeId: recipeId,
              image: matchedRecipe.image || null,
              calories: matchedRecipe.calories || 0,
              cookingTime: matchedRecipe.cookingTime || 'Not specified',
              dietType: matchedRecipe.dietType || [],
              tags: matchedRecipe.tags || [],
              nutritionalInfo: matchedRecipe.nutritionalInfo || null,
              hasRecipeDetails: true
            });
          } else {
            // Couldn't find the recipe - something went wrong
            console.warn(`Recipe ID ${recipeId} from meal plan not found in database`);
            day.meals.push({
              type: mealType,
              name: recipeName,
              recipeId: null,
              calories: 0,
              hasRecipeDetails: false,
              error: "Recipe ID not found in database"
            });
          }
        } else {
          // Fallback parsing for meals that don't match the expected format
          const basicMatch = mealLine.match(/- ([^:]+):\s*(.+)/);
          
          if (basicMatch) {
            day.meals.push({
              type: basicMatch[1].trim(),
              name: basicMatch[2].trim(),
              recipeId: null,
              calories: 0,
              hasRecipeDetails: false
            });
          }
        }
      }
      
      // Make sure we have the correct number of meals per day
      while (day.meals.length < mealsPerDay) {
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Evening Snack'];
        day.meals.push({
          type: mealTypes[day.meals.length] || `Meal ${day.meals.length + 1}`,
          name: "Not specified",
          recipeId: null,
          calories: 0,
          hasRecipeDetails: false
        });
      }
      
      mealPlan.days.push(day);
    }
    
    // Make sure we have the correct number of days
    while (mealPlan.days.length < daysCount) {
      const dayNumber = mealPlan.days.length + 1;
      const day = {
        day: `Day ${dayNumber}`,
        meals: []
      };
      
      // Add placeholder meals
      const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Evening Snack'];
      for (let i = 0; i < mealsPerDay; i++) {
        day.meals.push({
          type: mealTypes[i] || `Meal ${i + 1}`,
          name: "Not specified",
          recipeId: null,
          calories: 0,
          hasRecipeDetails: false
        });
      }
      
      mealPlan.days.push(day);
    }
    
    // Calculate nutritional summary for each day
    for (const day of mealPlan.days) {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      for (const meal of day.meals) {
        if (meal.calories) {
          totalCalories += meal.calories;
        }
        
        if (meal.nutritionalInfo) {
          if (meal.nutritionalInfo.protein) totalProtein += meal.nutritionalInfo.protein;
          if (meal.nutritionalInfo.carbs) totalCarbs += meal.nutritionalInfo.carbs;
          if (meal.nutritionalInfo.fat) totalFat += meal.nutritionalInfo.fat;
        }
      }
      
      day.nutritionSummary = {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      };
    }
    
  } catch (error) {
    console.error('Error parsing meal plan response:', error);
    // Return a minimal valid structure so the UI doesn't crash
    return {
      days: Array(daysCount).fill().map((_, i) => ({
        day: `Day ${i + 1}`,
        meals: Array(mealsPerDay).fill().map((_, j) => {
          const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Evening Snack'];
          return {
            type: mealTypes[j] || `Meal ${j + 1}`,
            name: "Error generating meal",
            recipeId: null,
            calories: 0,
            hasRecipeDetails: false,
            error: "Meal plan generation failed"
          };
        }),
        nutritionSummary: {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0
        }
      }))
    };
  }
  
  return mealPlan;
}

// Get the full recipe details for a meal in the meal plan
exports.getRecipeFromMealPlan = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    // Validate recipe ID
    if (!recipeId || recipeId === 'null') {
      return res.status(400).json({ 
        message: 'Invalid recipe ID' 
      });
    }
    
    // Fetch recipe from database
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found', 
        searchedId: recipeId 
      });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = exports;