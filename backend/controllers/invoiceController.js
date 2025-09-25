const Invoice = require("../models/Invoice");
const Application = require("../models/Application");

const getinvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceByApplication = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      applicationId: req.params.applicationId,
      userId: req.user.id,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addinvoice = async (req, res) => {
  const { applicationId, title, cost, method, details } = req.body;
  try {
    const invoice = await Invoice.create({
      userId: req.user.id,
      applicationId,
      title,
      cost,
      method,
      details,
      date: new Date(),
    });
    // udpate status
    const application = await Application.findById(applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    application.status = "Pending";
    await application.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateinvoice = async (req, res) => {
  const { title, cost, method, details } = req.body;
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (invoice.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    invoice.title = title || invoice.title;
    invoice.cost = cost || invoice.cost;
    invoice.method = method || invoice.method;
    invoice.details = details || invoice.details;
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteinvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (invoice.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await invoice.remove();
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getinvoices,
  getInvoiceByApplication,
  addinvoice,
  updateinvoice,
  deleteinvoice,
};
