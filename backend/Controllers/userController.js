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
    console.log("Login Request Received:", req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("User Authenticated:", user.email);

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
          dietType: user.dietType,
          allergies: user.allergies,
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
      dietType: user.dietType,
      allergies: user.allergies,
      likedRecipes: user.likedRecipes,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, age, gender, height, weight, activityLevel, goal, dietType, allergies, notificationPreferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.activityLevel = activityLevel || user.activityLevel;
    user.goal = goal || user.goal;
    user.dietType = dietType || user.dietType;
    user.allergies = allergies || user.allergies;

    if (notificationPreferences) {
      user.notificationPreferences = {
        notifications: notificationPreferences.notifications !== undefined 
          ? notificationPreferences.notifications 
          : user.notificationPreferences?.notifications || true,
        emailUpdates: notificationPreferences.emailUpdates !== undefined 
          ? notificationPreferences.emailUpdates 
          : user.notificationPreferences?.emailUpdates || true,
        mealReminders: notificationPreferences.mealReminders !== undefined 
          ? notificationPreferences.mealReminders 
          : user.notificationPreferences?.mealReminders || true
      };
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token"); // Clear JWT token if stored in cookies
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Add these methods to userController.js

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Notification Preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { notifications, emailUpdates, mealReminders } = req.body;
    
    // Update user schema to include notification preferences
    // This requires updating the User model first
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update notification preferences
    user.notificationPreferences = {
      notifications: notifications !== undefined ? notifications : user.notificationPreferences?.notifications,
      emailUpdates: emailUpdates !== undefined ? emailUpdates : user.notificationPreferences?.emailUpdates,
      mealReminders: mealReminders !== undefined ? mealReminders : user.notificationPreferences?.mealReminders
    };
    
    await user.save();
    
    res.json({ 
      message: "Notification preferences updated successfully", 
      notificationPreferences: user.notificationPreferences 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    // This assumes you're using multer or another middleware for file uploads
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update profile picture (filename or path)
    user.profilePicture = req.file.filename; // or req.file.path depending on your storage
    await user.save();
    
    res.json({ 
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Subscription Management
exports.upgradeSubscription = async (req, res) => {
  try {
    // This would integrate with a payment processor like Stripe
    const { paymentMethod } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Process payment and update subscription (simplified)
    // In a real application, this would involve more complex payment processing
    
    // Update user subscription
    user.subscription = {
      plan: "Premium",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    await user.save();
    
    res.json({ 
      message: "Subscription upgraded successfully",
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

