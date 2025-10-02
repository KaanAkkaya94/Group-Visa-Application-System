const Invoice = require("../models/Invoice");
const Application = require("../models/Application");

// Facade design pattern class for invoice operations, including admin logic
class InvoiceFacade {
  async getInvoices(user) {
    if (user.admin) {
      return await Invoice.find({});
    } else {
      return await Invoice.find({ userId: user.id });
    }
  }

  async getInvoiceByApplication(applicationId, user) {
    if (user.admin) {
      // Admin can specify userId in query
      const userId = user.userId || user.id;
      return await Invoice.findOne({ applicationId, userId });
    } else {
      return await Invoice.findOne({ applicationId, userId: user.id });
    }
  }

  async addInvoice(data, user) {
    const userId = user.admin ? data.userId : user.id;
    const invoice = await Invoice.create({
      userId,
      applicationId: data.applicationId,
      title: data.title,
      cost: data.cost,
      method: data.method,
      details: data.details,
      date: new Date(),
    });

    // Update application status
    const application = await Application.findById(data.applicationId);
    if (!application) throw new Error("Application not found");
    application.status = "Pending";
    await application.save();

    return invoice;
  }

  async updateInvoice(id, data, user) {
    const invoice = await Invoice.findById(id);
    if (!invoice) return null;

    const userId = user.admin ? data.userId : user.id;
    if (
      (!user.admin && invoice.userId.toString() !== user.id) ||
      (user.admin && invoice.userId.toString() !== userId)
    ) {
      return "unauthorized";
    }

    invoice.title = data.title || invoice.title;
    invoice.cost = data.cost || invoice.cost;
    invoice.method = data.method || invoice.method;
    invoice.details = data.details || invoice.details;
    return await invoice.save();
  }

  async deleteInvoice(id, user) {
    const invoice = await Invoice.findById(id);
    if (!invoice) return null;

    const userId = user.admin ? user.userId : user.id;
    if (
      (!user.admin && invoice.userId.toString() !== user.id) ||
      (user.admin && invoice.userId.toString() !== userId)
    ) {
      return "unauthorized";
    }

    await invoice.remove();
    return true;
  }
}

const invoiceFacade = new InvoiceFacade();

class InvoiceController {
  constructor(facade) {
    this.facade = facade;
  }
  async getInvoices(req, res) {
    try {
      const invoices = await this.facade.getInvoices(req.user);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInvoiceByApplication(req, res) {
    try {
      // For admin, userId can be passed in query
      req.user.userId = req.query.userId;
      const invoice = await this.facade.getInvoiceByApplication(
        req.params.applicationId,
        req.user
      );
      if (!invoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addInvoice(req, res) {
    try {
      const invoice = await this.facade.addInvoice(req.body, req.user);
      res.status(201).json(invoice);
    } catch (error) {
      if (error.message === "Application not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async updateInvoice(req, res) {
    try {
      const result = await this.facade.updateInvoice(
        req.params.id,
        req.body,
        req.user
      );
      if (result === null)
        return res.status(404).json({ message: "Invoice not found" });
      if (result === "unauthorized")
        return res.status(403).json({ message: "Not authorized" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteInvoice(req, res) {
    try {
      req.user.userId = req.query.userId;
      const result = await this.facade.deleteInvoice(req.params.id, req.user);
      if (result === null)
        return res.status(404).json({ message: "Invoice not found" });
      if (result === "unauthorized")
        return res.status(403).json({ message: "Not authorized" });
      res.json({ message: "Invoice deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
// Controller functions using the Facade
const invoiceController = new InvoiceController(invoiceFacade);
const getInvoices = invoiceController.getInvoices.bind(invoiceController);
const getInvoiceByApplication =
  invoiceController.getInvoiceByApplication.bind(invoiceController);
const addInvoice = invoiceController.addInvoice.bind(invoiceController);
const updateinvoice = invoiceController.addInvoice.bind(invoiceController);
const deleteInvoice = invoiceController.deleteInvoice.bind(invoiceController);

module.exports = {
  getInvoices,
  getInvoiceByApplication,
  addInvoice,
  updateinvoice,
  deleteInvoice,
};
