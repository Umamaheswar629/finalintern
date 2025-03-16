const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration
exports.registerUser = async (req, res) => {
  const { firstname,lastname, email, password, age, gender, height, weight, activityLevel, goal, dietType, allergies } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name :`${firstname} ${lastname}`,
      email,
      password: hashedPassword,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      dietType,
      allergies,
      likedRecipes:[],
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ 
        message:"User registered in successfully",
        token, user });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });

  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ 
        message:"User logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          activityLevel: user.activityLevel,
          goal: user.goal,
          dietaryPreferences: user.dietaryPreferences,
          allergens: user.allergens,
          likedRecipes: user.likedRecipes,
        } 
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dietaryPreferences: user.dietaryPreferences,
      allergens: user.allergens,
      likedRecipes: user.likedRecipes,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



