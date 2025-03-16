const mongoose = require("mongoose");

const nutritionalRequirementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  calorieTarget: { type: Number, required: true },
  macronutrientRatio: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
  },
});

module.exports = mongoose.model("NutritionalRequirement", nutritionalRequirementSchema);
