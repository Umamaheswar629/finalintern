// Controllers/nutritionalRequirementController.js
const NutritionalRequirement = require("../Models/NutritionalRequirement");
const User = require("../Models/User");
const { generateNutritionalRequirements } = require("../utils/nutritionCalculator");

// Generate requirements for user
exports.generateUserRequirements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Calculate nutritional requirements based on user data
    const requirements = generateNutritionalRequirements(user);
    
    // Check if user already has requirements
    let nutritionalReq = await NutritionalRequirement.findOne({ user: req.user.id });
    
    if (nutritionalReq) {
      // Update existing
      nutritionalReq.calorieTarget = requirements.calorieTarget;
      nutritionalReq.macronutrientRatio = requirements.macronutrientRatio;
    } else {
      // Create new
      nutritionalReq = new NutritionalRequirement({
        user: req.user.id,
        calorieTarget: requirements.calorieTarget,
        macronutrientRatio: requirements.macronutrientRatio
      });
    }
    
    await nutritionalReq.save();
    res.json(nutritionalReq);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get user requirements
exports.getUserRequirements = async (req, res) => {
  try {
    const nutritionalReq = await NutritionalRequirement.findOne({ user: req.user.id });
    if (!nutritionalReq) {
      return res.status(404).json({ message: "Nutritional requirements not found" });
    }
    res.json(nutritionalReq);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update user requirements manually
exports.updateUserRequirements = async (req, res) => {
  const { calorieTarget, macronutrientRatio } = req.body;
  
  try {
    let nutritionalReq = await NutritionalRequirement.findOne({ user: req.user.id });
    
    if (!nutritionalReq) {
      return res.status(404).json({ message: "Nutritional requirements not found" });
    }
    
    // Update fields
    if (calorieTarget) nutritionalReq.calorieTarget = calorieTarget;
    if (macronutrientRatio) nutritionalReq.macronutrientRatio = macronutrientRatio;
    
    await nutritionalReq.save();
    res.json(nutritionalReq);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};