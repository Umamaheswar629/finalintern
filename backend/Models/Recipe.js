const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      quantity: { type: Number, required: true }
    }
  ],
  instructions: { type: String, required: true },
  calories: { type: Number, required: true },
  macronutrients: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
