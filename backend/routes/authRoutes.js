const express = require("express");
const {
  registerUser,
  LoginFactory,
  userProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginFactory.getUser);
router.get("/profile", authMiddleware.protect, (req, res) =>
  userProfile.getProfile(req, res)
);
router.put("/profile", authMiddleware.protect, (req, res) =>
  userProfile.updateUserProfile(req, res)
);

module.exports = router;
