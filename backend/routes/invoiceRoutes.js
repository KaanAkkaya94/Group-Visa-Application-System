const express = require("express");
const {
  getInvoices,
  getInvoiceByApplication,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getInvoices).post(protect, addInvoice);

// Get invoice for a specific application
router.get("/application/:applicationId", protect, getInvoiceByApplication);

router.route("/:id").put(protect, updateInvoice).delete(protect, deleteInvoice);

module.exports = router;
