const express = require("express");
const {
  getTicket,
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, getTickets)
  .post(authMiddleware.protect, addTicket);

// Get invoice for a specific application
router.get("/tickets/:ticketId", authMiddleware.protect, getTicket);

router
  .route("/:id")
  .put(authMiddleware.protect, updateTicket)
  .delete(authMiddleware.protect, deleteTicket);

module.exports = router;
