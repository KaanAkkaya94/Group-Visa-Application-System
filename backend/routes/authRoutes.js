const express = require("express");
const {
  userRegistrationManager,
  LoginFactory,
  userProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.post("/register", userRegistrationManager.registerUser.bind(userRegistrationManager));
router.post("/login", LoginFactory.getUser);
router.get("/profile", authMiddleware.protect, (req, res) =>
  userProfile.getProfile(req, res)
);
router.put("/profile", authMiddleware.protect, (req, res) =>
  userProfile.updateUserProfile(req, res)
);

module.exports = router;
