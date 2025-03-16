// APIs/nutritionalRequirementRoutes.js
const express = require("express");
const { 
  generateUserRequirements,
  getUserRequirements,
  updateUserRequirements
} = require("../Controllers/nutritionalRequirementsController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Generate requirements based on user profile
router.post("/generate", generateUserRequirements);

// Get user's requirements
router.get("/", getUserRequirements);

// Update requirements manually
router.put("/", updateUserRequirements);

module.exports = router;