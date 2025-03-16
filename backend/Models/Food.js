const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // e.g., "Protein", "Vegetables"
  calories: { type: Number, required: true },
  macronutrients: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
  servingSize: { type: String, required: true }, // e.g., "100g", "1 cup"
});


module.exports = mongoose.model("Food", foodSchema);
