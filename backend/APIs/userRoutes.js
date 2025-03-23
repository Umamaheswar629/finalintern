const express = require("express");
const { registerUser, loginUser, getUserProfile , updateUserProfile, logoutUser } = require("../Controllers/userController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/updateProfile", authMiddleware, updateUserProfile);
router.post("/logout", logoutUser);

module.exports = router;
