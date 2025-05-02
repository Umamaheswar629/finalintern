// controllers/userMealController.js
const axios = require('axios');
const User = require('../Models/User');
const Recipe = require('../Models/Recipe');
const UserMeal = require('../Models/MealPlan');

/**
 * Generates daily meals for a user based on their preferences
 */
exports.generateDailyUserMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0]; // Default to today
    
    // Check if user already has meals for this date
    const existingMeals = await UserMeal.findOne({ 
      userId, 
      date
    });
    
    if (existingMeals) {
      // If meals exist, delete them to regenerate
      await UserMeal.findOneAndDelete({ userId, date });
    }
    
    // Track previously used recipe IDs (if regenerating)
    let previousRecipeIds = [];
    if (existingMeals && existingMeals.meals) {
      previousRecipeIds = existingMeals.meals
        .filter(meal => meal.recipeId)
        .map(meal => meal.recipeId);
    }
    
    // Get user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Extract user dietary preferences
    const { dietType, allergies, weight, height, age, gender, activityLevel, goalWeight } = user;
    
    // Calculate approximate daily calorie needs
    const goal = goalWeight < weight ? 'weight loss' : goalWeight > weight ? 'weight gain' : 'maintenance';
    const calorieNeeds = calculateCalorieNeeds(weight, height, age, gender, activityLevel, goal);
    
    // Fetch relevant recipes from the database based on user preferences
    const relevantRecipes = await fetchRelevantRecipesForUser(dietType, allergies, calorieNeeds);
    
    if (relevantRecipes.length === 0) {
      return res.status(400).json({ 
        message: 'No recipes found matching your dietary preferences. Please modify your requirements.'
      });
    }
    
    // Generate meal plan
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        message: 'API key for Gemini is not configured'
      });
    }
    
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    // Filter out previously used recipes if this is a regeneration
    // Modify this part in generateDailyUserMeals
let filteredRecipes = relevantRecipes;
if (previousRecipeIds.length > 0) {
  // Always try to filter out previous recipes first
  filteredRecipes = relevantRecipes.filter(recipe => 
    !previousRecipeIds.includes(recipe._id.toString())
  );
  
  // If filtering left us with too few recipes (less than 3), 
  // try to find at least one different recipe per meal
  if (filteredRecipes.length < 3) {
    console.log('Not enough new recipes, trying partial regeneration');
    // Keep at least 1 new recipe for each meal type if possible
    filteredRecipes = relevantRecipes;
  }
}
    
    // Construct prompt for Gemini
    const prompt = generateUserMealsPrompt(dietType, allergies, calorieNeeds, goal, filteredRecipes, previousRecipeIds);
    
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
            temperature: 0.9, // Increased temperature for more variability
            maxOutputTokens: 2048
          }
        }
      );
    } catch (apiError) {
      return res.status(500).json({
        message: 'Failed to generate meals using AI',
        error: apiError.message
      });
    }
    
    // Parse and structure the response
    const rawResponse = response.data.candidates[0].content.parts[0].text;
    const meals = await parseMealsResponse(rawResponse, relevantRecipes);
    
    // Save the generated meals for this user and date
    const newUserMeal = new UserMeal({
      userId,
      date,
      meals,
      nutritionSummary: calculateNutritionSummary(meals)
    });
    
    await newUserMeal.save();
    
    res.json({ 
      message: 'Daily meals generated successfully',
      meals 
    });
  } catch (error) {
    console.error('User Meal Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating daily meals', 
      error: error.message 
    });
  }
};

/**
 * Get user meals for today
 */
exports.getUserMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0]; // Always today
    
    // Find meals for this user and date
    let userMeals = await UserMeal.findOne({ userId, date });
    
    // If no meals exist for today, return 404 with needsGeneration flag
    if (!userMeals) {
      return res.status(404).json({
        message: 'No meals found for today',
        needsGeneration: true
      });
    }
    
    res.json(userMeals.meals);
  } catch (error) {
    console.error('Error fetching user meals:', error);
    res.status(500).json({ 
      message: 'Error fetching meals', 
      error: error.message 
    });
  }
};

/**
 * Get detailed recipe information for a specific meal
 */
exports.getRecipeDetails = async (req, res) => {
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
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ 
      message: error.message 
    });
  }
};

// Helper function to fetch relevant recipes based on user preferences
async function fetchRelevantRecipesForUser(dietType, allergies, targetCalories) {
    const query = {}; // Define query outside the try block
    
    try {
      // Filter by diet type if specified
      if (dietType && dietType !== 'any') {
        query.dietType = dietType;
      }
      
      // Handle allergies and restrictions
      if (allergies && allergies.length > 0) {
        // Ensure allergies is an array
        const allergyList = Array.isArray(allergies) 
          ? allergies 
          : allergies.split(',').map(a => a.trim().toLowerCase());
        
        const validAllergies = allergyList.filter(a => a.length > 0);
        
        if (validAllergies.length > 0) {
          // Create a $nin operator to exclude recipes with matching ingredients
          query['ingredients.name'] = { 
            $not: { 
              $in: validAllergies
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
      // Don't sort on array fields which could cause parallel arrays error
      const recipes = await Recipe.find(query)
        .sort({ 
          calories: -1  // Only sort by calories, which is a scalar field
        })
        .limit(200);
      
      console.log(`Final query returned ${recipes.length} recipes`);
        
      // Return recipes
      return recipes;
    }
    catch (error) {
      console.error("Error in fetchRelevantRecipesForUser:", error);
      // Return empty array instead of undefined in case of error
      return [];
    }
 }

// Generate prompt for AI
function generateUserMealsPrompt(dietType, allergies, calorieNeeds, goal, recipes, previousRecipeIds = []) {
  // Format allergies as string for prompt
  let allergiesText = '';
  if (allergies && allergies.length > 0) {
    const allergyList = Array.isArray(allergies) 
      ? allergies.join(', ') 
      : allergies;
    allergiesText = `The user has the following allergies or restrictions: ${allergyList}.`;
  }
  
  // Format recipes for the prompt - limit to 50 recipes
  const recipesToInclude = recipes.slice(0, 50);
  
  const recipeList = recipesToInclude.map(recipe => {
    const caloriesInfo = recipe.calories ? `${recipe.calories} calories` : 'calories not specified';
    const dietInfo = recipe.dietType ? `Diet: ${recipe.dietType}` : '';
    
    // Extract main ingredients
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
  
  // Add info about previously used recipes if applicable
  let previousMealsText = '';
  if (previousRecipeIds.length > 0) {
    previousMealsText = `
IMPORTANT: The user previously had the following recipe IDs in their meal plan: ${previousRecipeIds.join(', ')}. 
Please choose DIFFERENT recipes for this meal plan to provide variety.`;
  }
  
  return `Create a daily meal plan for a user with a ${dietType || 'general'} diet with approximately ${calorieNeeds} calories per day. 
${allergiesText}
The user's health goal is: ${goal}.
The plan should include breakfast, lunch, and dinner.${previousMealsText}

Use ONLY the following recipes from my database when creating the meal plan:
${recipeList}

Format your response exactly as follows:
- Breakfast: [Recipe Title] (ID: [Recipe ID])
- Lunch: [Recipe Title] (ID: [Recipe ID]) 
- Dinner: [Recipe Title] (ID: [Recipe ID])

IMPORTANT RULES:
1. You MUST use the exact recipe titles and IDs from the list I provided.
2. Try to balance nutrition across the day.
3. Follow this EXACT format for each meal: [Meal Type]: [Recipe Title] (ID: [Recipe ID])
4. Do not invent new recipes or IDs.
5. Try to stay within the target calories for the day.
6. Choose foods that work well together as a daily meal plan.
7. Maintain consistency in diet types. Since the user prefers a ${dietType || 'general'} diet, all three meals should follow this preference if possible.
8. MAKE SURE TO CHOOSE DIFFERENT RECIPES FROM ANY PREVIOUS MEAL PLANS.
9. When regenerate is clicked, make sure to generate different meal plan from the previous one.
10. STRICTLY AVOID using any of these previously used recipe IDs: ${previousRecipeIds.join(', ')}.
11. If you must reuse a recipe, NEVER reuse more than one from the previous meal plan.
12. Prioritize variety - choose recipes with different main ingredients than previous meals.`;
}

// Parse meals from AI response
async function parseMealsResponse(rawResponse, availableRecipes) {
  // Initialize empty meals array
  const meals = [];
  
  try {
    // Create a map of recipe IDs to recipe objects for quick lookup
    const recipeMap = new Map();
    availableRecipes.forEach(recipe => {
      recipeMap.set(recipe._id.toString(), recipe);
    });
    
    // Get all meal lines (lines starting with a dash)
    const mealLines = rawResponse.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'));
    
    // Process each meal line
    for (const mealLine of mealLines) {
      // Extract structured data with regex
      // Format should be: "- [Meal Type]: [Recipe Title] (ID: [Recipe ID])"
      const structuredMatch = mealLine.match(/- ([^:]+):\s*([^(]+)\s*\(ID:\s*([^)]+)\)/i);
      
      if (structuredMatch) {
        const mealType = structuredMatch[1].trim();
        const recipeName = structuredMatch[2].trim();
        const recipeId = structuredMatch[3].trim();
        
        // Look up the recipe in our map
        const matchedRecipe = recipeMap.get(recipeId);
        
        if (matchedRecipe) {
          // Found the recipe in our database
          meals.push({
            type: mealType,
            title: matchedRecipe.title,
            recipeId: recipeId,
            image: matchedRecipe.image || null,
            calories: matchedRecipe.calories || 0,
            ingredients: matchedRecipe.ingredients || [],
            hasRecipeDetails: true
          });
        } else {
          // Couldn't find the recipe
          console.warn(`Recipe ID ${recipeId} not found in database`);
          meals.push({
            type: mealType,
            title: recipeName,
            recipeId: null,
            calories: 0,
            hasRecipeDetails: false
          });
        }
      }
    }
    
    // Make sure we have 3 meals
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    for (let i = 0; i < mealTypes.length; i++) {
      const type = mealTypes[i];
      if (!meals.some(meal => meal.type === type)) {
        meals.push({
          type,
          title: "Not specified",
          recipeId: null,
          calories: 0,
          hasRecipeDetails: false
        });
      }
    }
    
    return meals;
  } catch (error) {
    console.error('Error parsing meals response:', error);
    return [
      { type: 'Breakfast', title: 'Error generating meal', recipeId: null, hasRecipeDetails: false },
      { type: 'Lunch', title: 'Error generating meal', recipeId: null, hasRecipeDetails: false },
      { type: 'Dinner', title: 'Error generating meal', recipeId: null, hasRecipeDetails: false }
    ];
  }
}

// Helper function to calculate nutrition summary
function calculateNutritionSummary(meals) {
  // Initialize values
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  // Sum up all nutritional values from meals
  meals.forEach(meal => {
    if (meal.calories) {
      totalCalories += meal.calories;
    }
    
    if (meal.nutritionalInfo) {
      if (meal.nutritionalInfo.protein) totalProtein += meal.nutritionalInfo.protein;
      if (meal.nutritionalInfo.carbs) totalCarbs += meal.nutritionalInfo.carbs;
      if (meal.nutritionalInfo.fat) totalFat += meal.nutritionalInfo.fat;
    }
  });
  
  return {
    calories: {
      consumed: totalCalories,
      goal: totalCalories,
      unit: 'kcal'
    },
    protein: {
      consumed: totalProtein,
      goal: Math.round((totalCalories * 0.3) / 4),
      unit: 'g'
    },
    carbs: {
      consumed: totalCarbs,
      goal: Math.round((totalCalories * 0.45) / 4),
      unit: 'g'
    },
    fat: {
      consumed: totalFat,
      goal: Math.round((totalCalories * 0.25) / 9),
      unit: 'g'
    }
  };
}

// Helper function to calculate calorie needs
function calculateCalorieNeeds(weight, height, age, gender, activityLevel, goal) {
  try {
    // Use Harris-Benedict equation for BMR
    let bmr = 0;
    
    if (gender && gender.toLowerCase() === 'female') {
      // BMR for women
      bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    } else {
      // BMR for men (default)
      bmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
    }
    
    // Adjust for activity level
    let tdee = bmr; // Total Daily Energy Expenditure
    
    switch (activityLevel?.toLowerCase()) {
      case 'sedentary':
        tdee = bmr * 1.2;
        break;
      case 'lightly active':
        tdee = bmr * 1.375;
        break;
      case 'moderately active':
        tdee = bmr * 1.55;
        break;
      case 'very active':
        tdee = bmr * 1.725;
        break;
      case 'extra active':
        tdee = bmr * 1.9;
        break;
      default:
        tdee = bmr * 1.375; // Default to lightly active
    }
    
    // Adjust based on goal
    let calorieNeeds = tdee;
    
    switch (goal?.toLowerCase()) {
      case 'weight loss':
        calorieNeeds = tdee - 500; // 500 calorie deficit
        break;
      case 'weight gain':
        calorieNeeds = tdee + 500; // 500 calorie surplus
        break;
      case 'maintenance':
      default:
        // Keep TDEE as is
        break;
    }
    
    // Ensure minimum healthy calorie level
    if (gender?.toLowerCase() === 'female' && calorieNeeds < 1200) {
      calorieNeeds = 1200;
    } else if (calorieNeeds < 1500) {
      calorieNeeds = 1500;
    }
    
    return Math.round(calorieNeeds);
  } catch (error) {
    console.warn('Error calculating calorie needs, using default:', error);
    return 2000; // Default value if calculation fails
  }
}

module.exports = exports;