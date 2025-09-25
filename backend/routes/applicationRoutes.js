const express = require("express");
// const { getApplications, getApplication, addapplication, updateapplication, deleteapplication } = require('../controllers/applicationController');
const {
  applicationController,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware.protect, applicationController.getApplications); // Fetch all applications
router.get(
  "/:id",
  authMiddleware.protect,
  applicationController.getApplication
); // Fetch a single application
router.post("/", authMiddleware.protect, applicationController.addApplication); // Create new application
router.put(
  "/:id",
  authMiddleware.protect,
  applicationController.updateApplication
); // Update application
router.delete(
  "/:id",
  authMiddleware.protect,
  applicationController.deleteApplication
); // Delete application

module.exports = router;
