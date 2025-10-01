const express = require("express");
const {
  getApplications, getApplication, addApplication, updateApplication, deleteApplication
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware.protect, getApplications);
router.get(
  "/:id",
  authMiddleware.protect,
  getApplication
); // Fetch a single application
router.post("/", authMiddleware.protect, addApplication);
router.put(
  "/:id",
  authMiddleware.protect,
  updateApplication
); // Update application
router.delete(
  "/:id",
  authMiddleware.protect,
  deleteApplication
); // Delete application

module.exports = router;
