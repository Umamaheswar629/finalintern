const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  activityLevel: { type: String, enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"], required: true },
  goal: { type: String, enum: ["Lose weight", "Maintain weight", "Gain weight"], required: true },
  dietType: [{ type: String }], // e.g., ["Vegetarian", "Keto", "Gluten-Free"]
  allergies: [{ type: String }], // e.g., ["Peanuts", "Dairy"]
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe",default:[] }],
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: "" },
  notificationPreferences: {
  notifications: { type: Boolean, default: true },
  emailUpdates: { type: Boolean, default: true },
  mealReminders: { type: Boolean, default: true}
},
subscription: {
  plan: { type: String, enum: ["Free", "Premium"], default: "Free" },
  startDate: { type: Date },
  endDate: { type: Date }
}
});

module.exports = mongoose.model("User", userSchema);
