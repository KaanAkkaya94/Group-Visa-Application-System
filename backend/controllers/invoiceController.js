const Invoice = require('../models/Invoice');

// Facade class for invoice operations
class InvoiceFacade {
  async getInvoices(userId) {
    return await Invoice.find({ userId });
  }

  async getInvoiceByApplication(applicationId, userId) {
    return await Invoice.findOne({ applicationId, userId });
  }

  async addInvoice(data, userId) {
    return await Invoice.create({
      userId,
      applicationId: data.applicationId,
      title: data.title,
      cost: data.cost,
      method: data.method,
      details: data.details,
      date: new Date()
    });
  }

  async updateInvoice(id, data, userId) {
    const invoice = await Invoice.findById(id);
    if (!invoice) return null;
    if (invoice.userId.toString() !== userId) return 'unauthorized';

    invoice.title = data.title || invoice.title;
    invoice.cost = data.cost || invoice.cost;
    invoice.method = data.method || invoice.method;
    invoice.details = data.details || invoice.details;
    return await invoice.save();
  }

  async deleteInvoice(id, userId) {
    const invoice = await Invoice.findById(id);
    if (!invoice) return null;
    if (invoice.userId.toString() !== userId) return 'unauthorized';

    await invoice.remove();
    return true;
  }
}

const invoiceFacade = new InvoiceFacade();

// Controller functions using the Facade
const getinvoices = async (req, res) => {
  try {
    const invoices = await invoiceFacade.getInvoices(req.user.id);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceByApplication = async (req, res) => {
  try {
    const invoice = await invoiceFacade.getInvoiceByApplication(req.params.applicationId, req.user.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addinvoice = async (req, res) => {
  try {
    const invoice = await invoiceFacade.addInvoice(req.body, req.user.id);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateinvoice = async (req, res) => {
  try {
    const result = await invoiceFacade.updateInvoice(req.params.id, req.body, req.user.id);
    if (result === null) return res.status(404).json({ message: 'Invoice not found' });
    if (result === 'unauthorized') return res.status(403).json({ message: 'Not authorized' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteinvoice = async (req, res) => {
  try {
    const result = await invoiceFacade.deleteInvoice(req.params.id, req.user.id);
    if (result === null) return res.status(404).json({ message: 'Invoice not found' });
    if (result === 'unauthorized') return res.status(403).json({ message: 'Not authorized' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getinvoices, getInvoiceByApplication, addinvoice, updateinvoice, deleteinvoice };