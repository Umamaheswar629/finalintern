// Controllers/foodController.js
const Food = require("../Models/Food");

// Get all foods
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create new food
exports.createFood = async (req, res) => {
  const { name, category, calories, macronutrients, servingSize } = req.body;

  try {
    const newFood = new Food({
      name,
      category,
      calories,
      macronutrients,
      servingSize
    });

    const food = await newFood.save();
    res.status(201).json(food);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update food
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food removed" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};