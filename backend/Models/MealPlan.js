const mongoose = require("mongoose");

// Schema for nutritional goals and consumption
const NutritionItemSchema = new mongoose.Schema({
  consumed: {
    type: Number,
    default: 0
  },
  goal: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'g'
  }
});

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  nutritionSummary: {
    calories: NutritionItemSchema,
    protein: NutritionItemSchema,
    carbs: NutritionItemSchema,
    fat: NutritionItemSchema
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
