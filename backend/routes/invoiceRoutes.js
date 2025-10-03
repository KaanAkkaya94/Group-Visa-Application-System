const express = require("express");
const {
  getInvoices,
  getInvoiceByApplication,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, getInvoices)
  .post(protect, addInvoice);

// Get invoice for a specific application
router.get(
  "/application/:applicationId",
  authMiddleware.protect,
  getInvoiceByApplication
);

router
  .route("/:id")
  .put(authMiddleware.protect, updateInvoice)
  .delete(authMiddleware.protect, deleteInvoice);

module.exports = router;
