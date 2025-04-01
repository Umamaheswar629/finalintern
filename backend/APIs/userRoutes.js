const express = require("express");
const { registerUser, loginUser, getUserProfile , updateUserProfile, logoutUser,changePassword, updateNotificationPreferences, uploadProfilePicture, upgradeSubscription} = require("../Controllers/userController");
const authMiddleware = require("../Middlewares/authMiddleware");
const multer = require("multer");
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/profile-pictures");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.mimetype.split("/")[1];
      cb(null, `${req.user.id}-${uniqueSuffix}.${extension}`);
    }
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      // Accept only images
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"), false);
      }
    }
  });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/logout", logoutUser);
router.put("/change-password", authMiddleware, changePassword);
router.put("/notification-preferences", authMiddleware, updateNotificationPreferences);
router.post("/profile-picture", authMiddleware, upload.single("profilePicture"), uploadProfilePicture);
router.post("/subscriptions/upgrade", authMiddleware, upgradeSubscription);

module.exports = router;
