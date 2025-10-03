//test file for tickets
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const assert = require("chai").assert;
const sinon = require("sinon");
const Ticket = require("../models/Ticket");
const TicketNo = require("../models/TicketNo");
const ticketController = require("../controllers/ticketController");

describe("ticketController instance methods", function () {
  afterEach(() => sinon.restore());

  describe("getTickets", function () {
    it("T056 should return tickets for admin", async function () {
      const req = { user: { admin: true, id: "adminid" } };
      const fakeTickets = [{ subject: "Admin Ticket" }];
      const serviceStub = sinon
        .stub(ticketController.ticketService, "getTickets")
        .resolves(fakeTickets);
      sinon.stub(ticketController.ticketService, "setStrategy");
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await ticketController.getTickets(req, res);
      assert.isTrue(res.json.calledWith(fakeTickets));
      assert.isTrue(serviceStub.calledOnce);
    });

    it("T057 should return 404 if tickets returns null", async function () {
      const req = { user: { admin: false, id: "userid" } };
      sinon.stub(ticketController.ticketService, "getTickets").resolves(null);
      sinon.stub(ticketController.ticketService, "setStrategy");
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.getTickets(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T058 should handle error (500)", async function () {
      const req = { user: { admin: false, id: "userid" } };
      sinon
        .stub(ticketController.ticketService, "getTickets")
        .throws(new Error("DB Error"));
      sinon.stub(ticketController.ticketService, "setStrategy");
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.getTickets(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("addTicket", function () {
    it("T059 should create a new ticket (201)", async function () {
      const req = {
        user: { id: "userid" },
        body: {
          username: "user",
          subject: "sub",
          email: "e",
          message: "m",
          createdAt: new Date(),
        },
      };
      const sortStub = sinon.stub().resolves({ ticketNo: "T00001" });
      sinon.stub(TicketNo, "findOne").returns({ sort: sortStub });
      sinon.stub(TicketNo.prototype, "save").resolves();
      sinon.stub(Ticket, "create").resolves({ id: "tid", ...req.body });
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.addTicket(req, res);
      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledOnce);
    });

    it("T060 should handle error (500)", async function () {
      const sortStub = sinon.stub().resolves(null);
      sinon.stub(TicketNo, "findOne").returns({ sort: sortStub });
      sinon.stub(TicketNo.prototype, "save").resolves();
      sinon.stub(Ticket, "create").throws(new Error("DB Error"));
      const req = {
        user: { id: "userid" },
        body: {
          username: "user",
          subject: "sub",
          email: "e",
          message: "m",
          createdAt: new Date(),
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.addTicket(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("updateTicket", function () {
    it("T061 should update existing ticket", async function () {
      const req = {
        params: { id: "tid" },
        body: {
          username: "user",
          subject: "sub",
          message: "m",
          email: "e",
          status: "open",
        },
      };
      const fakeTicket = { save: sinon.stub().resolvesThis(), ...req.body };
      sinon.stub(Ticket, "findById").resolves(fakeTicket);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await ticketController.updateTicket(req, res);
      assert.isTrue(fakeTicket.save.calledOnce);
      assert.isTrue(res.json.calledWith(fakeTicket));
    });

    it("T062 should return 404 for missing ticket", async function () {
      sinon.stub(Ticket, "findById").resolves(null);
      const req = { params: { id: "tid" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.updateTicket(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T063 should handle error (500)", async function () {
      sinon.stub(Ticket, "findById").throws(new Error("DB Error"));
      const req = { params: { id: "tid" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.updateTicket(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("deleteTicket", function () {
    it("T064 should delete existing ticket", async function () {
      const req = { params: { id: "tid" } };
      const fakeTicket = { remove: sinon.stub().resolves() };
      sinon.stub(Ticket, "findById").resolves(fakeTicket);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await ticketController.deleteTicket(req, res);
      assert.isTrue(fakeTicket.remove.calledOnce);
      assert.isTrue(res.json.calledWith({ message: "ticket deleted" }));
    });

    it("T065 should return 404 when missing", async function () {
      sinon.stub(Ticket, "findById").resolves(null);
      const req = { params: { id: "tid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.deleteTicket(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T066 should handle error (500)", async function () {
      sinon.stub(Ticket, "findById").throws(new Error("DB Error"));
      const req = { params: { id: "tid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await ticketController.deleteTicket(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });
});
