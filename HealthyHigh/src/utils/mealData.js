// src/utils/mealData.js

// Sample meal data for testing and development
const mealData = {
    // Breakfast options
    breakfast: [
      {
        id: 'b1',
        name: 'Greek Yogurt Parfait',
        calories: 320,
        protein: 18,
        carbs: 42,
        fat: 10,
        prepTime: 10,
        ingredients: [
          '1 cup Greek yogurt',
          '1/2 cup mixed berries',
          '1/4 cup granola',
          '1 tbsp honey'
        ],
        dietaryTags: ['vegetarian', 'high-protein'],
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHlvZ3VydCUyMHBhcmZhaXR8ZW58MHx8fHwxNTkzMDQ0NTQx&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'b2',
        name: 'Avocado Toast with Egg',
        calories: 380,
        protein: 15,
        carbs: 35,
        fat: 22,
        prepTime: 15,
        ingredients: [
          '2 slices whole grain bread',
          '1 avocado',
          '2 eggs',
          'Salt and pepper to taste',
          'Red pepper flakes (optional)'
        ],
        dietaryTags: ['vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YXZvY2FkbyUyMHRvYXN0fGVufDB8fHx8MTU5MzA0NDU5OA&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'b3',
        name: 'Protein Smoothie Bowl',
        calories: 340,
        protein: 22,
        carbs: 48,
        fat: 8,
        prepTime: 10,
        ingredients: [
          '1 banana',
          '1 cup frozen berries',
          '1 scoop protein powder',
          '1/2 cup almond milk',
          'Toppings: chia seeds, sliced fruit, granola'
        ],
        dietaryTags: ['vegetarian', 'vegan-option', 'high-protein'],
        imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c21vb3RoaWUlMjBib3dsfGVufDB8fHx8MTU5MzA0NDY0OQ&ixlib=rb-1.2.1&q=80&w=1080'
      }
    ],
    
    // Lunch options
    lunch: [
      {
        id: 'l1',
        name: 'Quinoa Salad Bowl',
        calories: 420,
        protein: 15,
        carbs: 65,
        fat: 12,
        prepTime: 20,
        ingredients: [
          '1 cup cooked quinoa',
          '1 cup mixed greens',
          '1/4 cup chickpeas',
          '1/4 cup diced cucumber',
          '1/4 cup cherry tomatoes',
          '2 tbsp olive oil and lemon dressing'
        ],
        dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
        imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8cXVpbm9hJTIwc2FsYWR8ZW58MHx8fHwxNTkzMDQ0Njkx&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'l2',
        name: 'Turkey and Avocado Wrap',
        calories: 450,
        protein: 28,
        carbs: 39,
        fat: 22,
        prepTime: 15,
        ingredients: [
          '1 whole grain wrap',
          '4 oz sliced turkey breast',
          '1/2 avocado, sliced',
          'Lettuce and tomato',
          '1 tbsp mayo or mustard'
        ],
        dietaryTags: ['high-protein'],
        imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d3JhcHxlbnwwfHx8fDE1OTMwNDQ3Mzk&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'l3',
        name: 'Lentil Soup with Bread',
        calories: 380,
        protein: 18,
        carbs: 58,
        fat: 8,
        prepTime: 30,
        ingredients: [
          '1 cup lentil soup',
          '1 slice whole grain bread',
          '1 tsp olive oil'
        ],
        dietaryTags: ['vegetarian', 'vegan', 'high-fiber'],
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bGVudGlsJTIwc291cHxlbnwwfHx8fDE1OTMwNDQ3ODA&ixlib=rb-1.2.1&q=80&w=1080'
      }
    ],
    
    // Dinner options
    dinner: [
      {
        id: 'd1',
        name: 'Baked Salmon with Roasted Vegetables',
        calories: 480,
        protein: 32,
        carbs: 25,
        fat: 28,
        prepTime: 35,
        ingredients: [
          '6 oz salmon fillet',
          '1 cup mixed vegetables (broccoli, carrots, bell peppers)',
          '1 tbsp olive oil',
          'Herbs and spices',
          '1/2 cup brown rice'
        ],
        dietaryTags: ['high-protein', 'gluten-free', 'dairy-free'],
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fHx8MTU5MzA0NDgzMQ&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'd2',
        name: 'Chicken Stir-Fry with Brown Rice',
        calories: 520,
        protein: 35,
        carbs: 48,
        fat: 22,
        prepTime: 25,
        ingredients: [
          '5 oz chicken breast, sliced',
          '2 cups mixed vegetables',
          '1 tbsp soy sauce',
          '1 tbsp sesame oil',
          '1/2 cup brown rice'
        ],
        dietaryTags: ['high-protein', 'dairy-free'],
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3RpciUyMGZyeXxlbnwwfHx8fDE1OTMwNDQ4Njk&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 'd3',
        name: 'Vegetarian Chili with Cornbread',
        calories: 450,
        protein: 18,
        carbs: 68,
        fat: 14,
        prepTime: 40,
        ingredients: [
          '1 cup black beans and kidney beans',
          '1 cup diced tomatoes',
          '1/2 cup bell peppers and onions',
          'Chili seasoning',
          '1 piece cornbread'
        ],
        dietaryTags: ['vegetarian', 'vegan-option', 'high-fiber'],
        imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2hpbGl8ZW58MHx8fHwxNTkzMDQ0OTAy&ixlib=rb-1.2.1&q=80&w=1080'
      }
    ],
    
    // Snack options
    snacks: [
      {
        id: 's1',
        name: 'Apple with Almond Butter',
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
        prepTime: 5,
        ingredients: [
          '1 medium apple',
          '2 tbsp almond butter'
        ],
        dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
        imageUrl: 'https://images.unsplash.com/photo-1568909218940-9ca084ad57de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGFwcGxlJTIwd2l0aCUyMGFsbW9uZCUyMGJ1dHRlcnxlbnwwfHx8fDE1OTMwNDQ5NDA&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 's2',
        name: 'Greek Yogurt with Honey',
        calories: 180,
        protein: 15,
        carbs: 18,
        fat: 5,
        prepTime: 5,
        ingredients: [
          '1 cup Greek yogurt',
          '1 tbsp honey',
          'Dash of cinnamon'
        ],
        dietaryTags: ['vegetarian', 'gluten-free', 'high-protein'],
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8eW9ndXJ0fGVufDB8fHx8MTU5MzA0NDk3OA&ixlib=rb-1.2.1&q=80&w=1080'
      },
      {
        id: 's3',
        name: 'Trail Mix',
        calories: 220,
        protein: 7,
        carbs: 20,
        fat: 15,
        prepTime: 0,
        ingredients: [
          '1/4 cup mixed nuts',
          '2 tbsp dried fruit',
          '1 tbsp dark chocolate chips'
        ],
        dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
        imageUrl: 'https://images.unsplash.com/photo-1541990202460-19e91e27add2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHJhaWwlMjBtaXh8ZW58MHx8fHwxNTkzMDQ1MDE0&ixlib=rb-1.2.1&q=80&w=1080'
      }
    ]
  };
  
  // Helper functions to use with the meal data
  export const getMealsByType = (type) => {
    return mealData[type] || [];
  };
  
  export const getMealById = (id) => {
    for (const mealType in mealData) {
      const meal = mealData[mealType].find(meal => meal.id === id);
      if (meal) return meal;
    }
    return null;
  };
  
  export const getRandomMeal = (type) => {
    const meals = getMealsByType(type);
    return meals[Math.floor(Math.random() * meals.length)];
  };
  
  export const generateMealPlan = (preferences = {}) => {
    const { 
      calories = 2000,
      mealsPerDay = 3,
      dietaryPreferences = [] 
    } = preferences;
    
    let plan = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: []
    };
    
    // Always include breakfast, lunch, and dinner
    plan.meals.push({
      type: 'breakfast',
      ...getRandomMeal('breakfast')
    });
    
    plan.meals.push({
      type: 'lunch',
      ...getRandomMeal('lunch')
    });
    
    plan.meals.push({
      type: 'dinner',
      ...getRandomMeal('dinner')
    });
    
    // Add snacks if mealsPerDay > 3
    if (mealsPerDay > 3) {
      for (let i = 0; i < mealsPerDay - 3; i++) {
        plan.meals.push({
          type: 'snack',
          ...getRandomMeal('snacks')
        });
      }
    }
    
    // Calculate nutrition totals
    plan.meals.forEach(meal => {
      plan.totalCalories += meal.calories;
      plan.totalProtein += meal.protein;
      plan.totalCarbs += meal.carbs;
      plan.totalFat += meal.fat;
    });
    
    return plan;
  };
  
  export default mealData;