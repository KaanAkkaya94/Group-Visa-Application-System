const express = require('express');
const { getApplications, getApplication, addapplication, updateapplication, deleteapplication } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware.protect, getApplications); // Fetch all applications
router.get('/:id', authMiddleware.protect, getApplication); // Fetch a single application
router.post('/', authMiddleware.protect, addapplication); // Create new application
router.put('/:id', authMiddleware.protect, updateapplication); // Update application
router.delete('/:id', authMiddleware.protect, deleteapplication); // Delete application

module.exports = router;