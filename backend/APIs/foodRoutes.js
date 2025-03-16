// APIs/foodRoutes.js
const express = require("express");
const { 
  getAllFoods, 
  getFoodById, 
  createFood, 
  updateFood, 
  deleteFood 
} = require("../Controllers/foodController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllFoods);
router.get("/:id", getFoodById);

// Protected routes
router.post("/", authMiddleware, createFood);
router.put("/:id", authMiddleware, updateFood);
router.delete("/:id", authMiddleware, deleteFood);

module.exports = router;