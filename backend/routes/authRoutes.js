const express = require("express");
const {
  LoginFactory,
  userProfile,
  registerUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginFactory.getUser);
router.get("/profile", authMiddleware.protect, (req, res) =>
  userProfile.getProfile(req, res)
);

router.put("/profile/:id", authMiddleware.protect, (req, res) =>
  userProfile.updateUserProfileById(req, res)
);

router.put("/profile", authMiddleware.protect, (req, res) =>
  userProfile.updateUserProfile(req, res)
);
// for admin
router.get("/", authMiddleware.protect, authMiddleware.admin, getAllUsers);
router.delete("/:id", authMiddleware.protect, authMiddleware.admin, deleteUser);

module.exports = router;
