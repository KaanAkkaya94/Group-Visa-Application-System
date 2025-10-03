//test file for invoice 
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const assert = require("chai").assert;
const sinon = require("sinon");
const Invoice = require("../models/Invoice");
const Application = require("../models/Application");
const {
  getInvoices,
  getInvoiceByApplication,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

describe("invoiceController exports", function () {
  afterEach(() => sinon.restore());

  describe("getInvoices", function () {
    it("T039 should return invoices for admin", async function () {
      const req = { user: { admin: true, id: "adminid" } };
      const fakeInvoices = [{ title: "Invoice1" }];
      sinon.stub(Invoice, "find").resolves(fakeInvoices);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getInvoices(req, res);
      assert.isTrue(res.json.calledWith(fakeInvoices));
    });

    it("T040 should return invoices for user", async function () {
      const req = { user: { admin: false, id: "userid" } };
      const fakeInvoices = [{ title: "Invoice2" }];
      sinon.stub(Invoice, "find").resolves(fakeInvoices);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getInvoices(req, res);
      assert.isTrue(res.json.calledWith(fakeInvoices));
    });

    it("T041 should handle error (500)", async function () {
      sinon.stub(Invoice, "find").throws(new Error("DB Error"));
      const req = { user: { admin: false, id: "userid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getInvoices(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("getInvoiceByApplication", function () {
    it("T042 should return invoice by applicationId for admin", async function () {
      const req = {
        params: { applicationId: "appid" },
        user: { admin: true, userId: "userid", id: "userid" },
        query: { userId: "userid" },
      };
      const fakeInvoice = { title: "Invoice1" };
      sinon.stub(Invoice, "findOne").resolves(fakeInvoice);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getInvoiceByApplication(req, res);
      assert.isTrue(res.json.calledWith(fakeInvoice));
    });

    it("T043 should return 404 if invoice not found", async function () {
      const req = {
        params: { applicationId: "appid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      sinon.stub(Invoice, "findOne").resolves(null);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getInvoiceByApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T044 should handle error (500)", async function () {
      const req = {
        params: { applicationId: "appid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      sinon.stub(Invoice, "findOne").throws(new Error("DB Error"));
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getInvoiceByApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("addInvoice", function () {
    it("T045 should create a new invoice (201)", async function () {
      const req = {
        body: {
          applicationId: "appid",
          title: "Invoice",
          cost: 100,
          method: "card",
          details: "details",
          userId: "userid",
        },
        user: { admin: true, id: "adminid" },
      };
      const fakeInvoice = { title: "Invoice" };
      sinon.stub(Invoice, "create").resolves(fakeInvoice);
      sinon
        .stub(Application, "findById")
        .resolves({ status: "", save: sinon.stub().resolves() });
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addInvoice(req, res);
      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledWith(fakeInvoice));
    });

    it("T046 should return 404 if application not found", async function () {
      sinon.stub(Invoice, "create").resolves({});
      sinon.stub(Application, "findById").resolves(null);
      const req = {
        body: {
          applicationId: "appid",
          title: "Invoice",
          cost: 100,
          method: "card",
          details: "details",
          userId: "userid",
        },
        user: { admin: true, id: "adminid" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addInvoice(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T047 should handle error (500)", async function () {
      sinon.stub(Invoice, "create").throws(new Error("DB Error"));
      const req = {
        body: {
          applicationId: "appid",
          title: "Invoice",
          cost: 100,
          method: "card",
          details: "details",
          userId: "userid",
        },
        user: { admin: true, id: "adminid" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addInvoice(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("updateInvoice", function () {
    it("T048 should update existing invoice", async function () {
      const req = {
        params: { id: "invoiceid" },
        body: { title: "Updated" },
        user: { admin: false, id: "userid" },
      };
      const fakeInvoice = {
        userId: "userid",
        title: "Old",
        save: sinon.stub().resolvesThis(),
      };
      sinon.stub(Invoice, "findById").resolves(fakeInvoice);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await updateInvoice(req, res);
      assert.isTrue(fakeInvoice.save.calledOnce);
      assert.isTrue(res.json.calledWith(fakeInvoice));
    });

    it("T049 should return 404 when missing", async function () {
      sinon.stub(Invoice, "findById").resolves(null);
      const req = {
        params: { id: "invoiceid" },
        body: {},
        user: { admin: false, id: "userid" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateInvoice(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T050 should reject unauthorized 403", async function () {
      const req = {
        params: { id: "invoiceid" },
        body: { userId: "otherid" },
        user: { admin: false, id: "userid" },
      };
      const fakeInvoice = {
        userId: "otherid",
        save: sinon.stub().resolvesThis(),
      };
      sinon.stub(Invoice, "findById").resolves(fakeInvoice);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateInvoice(req, res);
      assert.isTrue(res.status.calledWith(403));
      assert.isTrue(res.json.calledOnce);
    });

    it("T051 should handle error (500)", async function () {
      sinon.stub(Invoice, "findById").throws(new Error("DB Error"));
      const req = {
        params: { id: "invoiceid" },
        body: {},
        user: { admin: false, id: "userid" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateInvoice(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("deleteinvoice", function () {
    it("T052 should delete invoice", async function () {
      const req = {
        params: { id: "invoiceid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      const fakeInvoice = { userId: "userid", remove: sinon.stub().resolves() };
      sinon.stub(Invoice, "findById").resolves(fakeInvoice);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteInvoice(req, res);
      assert.isTrue(fakeInvoice.remove.calledOnce);
      assert.isTrue(res.json.calledWith({ message: "Invoice deleted" }));
    });

    it("T053 should return 404 when missing", async function () {
      sinon.stub(Invoice, "findById").resolves(null);
      const req = {
        params: { id: "invoiceid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteInvoice(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T054 should reject unauthorized (403)", async function () {
      const req = {
        params: { id: "invoiceid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      const fakeInvoice = {
        userId: "otherid",
        remove: sinon.stub().resolves(),
      };
      sinon.stub(Invoice, "findById").resolves(fakeInvoice);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteInvoice(req, res);
      assert.isTrue(res.status.calledWith(403));
      assert.isTrue(res.json.calledOnce);
    });

    it("T055 should handle error (500)", async function () {
      sinon.stub(Invoice, "findById").throws(new Error("DB Error"));
      const req = {
        params: { id: "invoiceid" },
        user: { admin: false, id: "userid" },
        query: {},
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteInvoice(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });
});
