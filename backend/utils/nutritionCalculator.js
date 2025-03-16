// Utils/nutritionCalculator.js
/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
 */
const calculateBMR = (weight, height, age, gender) => {
    // Weight in kg, height in cm, age in years
    if (gender === "Male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };
  
  /**
   * Calculate Total Daily Energy Expenditure (TDEE)
   */
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      "Sedentary": 1.2,       // Little or no exercise
      "Light": 1.375,         // Light exercise 1-3 days/week
      "Moderate": 1.55,       // Moderate exercise 3-5 days/week
      "Active": 1.725,        // Heavy exercise 6-7 days/week
      "Very Active": 1.9      // Very heavy exercise, physical job or training twice a day
    };
    
    return bmr * activityMultipliers[activityLevel];
  };
  
  /**
   * Calculate calorie target based on user goal
   */
  const calculateCalorieTarget = (tdee, goal) => {
    switch (goal) {
      case "Lose Weight":
        return tdee - 500; // 500 calorie deficit for ~1lb/week loss
      case "Gain Weight":
        return tdee + 500; // 500 calorie surplus for ~1lb/week gain
      case "Maintain Weight":
      default:
        return tdee;
    }
  };
  
  /**
   * Calculate recommended macronutrient distribution
   */
  const calculateMacros = (calorieTarget, goal) => {
    let proteinRatio, carbsRatio, fatRatio;
    
    // Adjust macros based on goal
    switch (goal) {
      case "Lose Weight":
        proteinRatio = 0.4;  // Higher protein for satiety and muscle preservation
        carbsRatio = 0.3;
        fatRatio = 0.3;
        break;
      case "Gain Weight":
        proteinRatio = 0.3;
        carbsRatio = 0.45;  // Higher carbs for energy and muscle glycogen
        fatRatio = 0.25;
        break;
      case "Maintain Weight":
      default:
        proteinRatio = 0.3;
        carbsRatio = 0.4;
        fatRatio = 0.3;
    }
    
    // Calculate grams
    // Protein & carbs = 4 calories per gram, fat = 9 calories per gram
    const proteinGrams = Math.round((calorieTarget * proteinRatio) / 4);
    const carbsGrams = Math.round((calorieTarget * carbsRatio) / 4);
    const fatGrams = Math.round((calorieTarget * fatRatio) / 9);
    
    return {
      protein: proteinGrams,
      carbs: carbsGrams,
      fats: fatGrams
    };
  };
  
  /**
   * Generate nutritional requirements based on user profile
   */
  exports.generateNutritionalRequirements = (user) => {
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, user.goal);
    const macros = calculateMacros(calorieTarget, user.goal);
    
    return {
      calorieTarget,
      macronutrientRatio: macros
    };
  };