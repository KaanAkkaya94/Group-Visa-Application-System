const express = require("express");
const {
  userRegistrationManager,
  LoginFactory,
  userProfile,
  registerUser,
  getAllUsers,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginFactory.getUser);
router.get("/profile", authMiddleware.protect, (req, res) =>
  userProfile.getProfile(req, res)
);
router.put("/profile", authMiddleware.protect, (req, res) =>
  userProfile.updateUserProfile(req, res)
);
// for admin
router.get("/", authMiddleware.protect, getAllUsers);

module.exports = router;
