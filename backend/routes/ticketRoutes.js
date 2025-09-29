const express = require("express");
// const {
//   getTicket,
//   getTickets,
//   addTicket,
//   updateTicket,
//   deleteTicket,
// } = require("../controllers/ticketController");
const ticketController = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(
    authMiddleware.protect,
    ticketController.getTickets.bind(ticketController)
  )
  .post(
    authMiddleware.protect,
    ticketController.addTicket.bind(ticketController)
  );

// Get invoice for a specific application
router.get(
  "/tickets/:ticketId",
  authMiddleware.protect,
  ticketController.getTicket.bind(ticketController)
);

router
  .route("/:id")
  .put(
    authMiddleware.protect,
    ticketController.updateTicket.bind(ticketController)
  )
  .delete(
    authMiddleware.protect,
    ticketController.deleteTicket.bind(ticketController)
  );

module.exports = router;
