const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  meals: [
    {
      mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Snack"], required: true },
      recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
    }
  ],
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);
