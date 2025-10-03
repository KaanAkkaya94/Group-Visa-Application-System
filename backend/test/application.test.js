//test file for applications
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const assert = require("chai").assert;
const sinon = require("sinon");
const mongoose = require("mongoose");
const {
  getApplications,
  getApplication,
  addApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

const ApplicationService = require("../service/ApplicationService");
const service = ApplicationService.prototype;

describe("applicationController exports", function () {
  afterEach(() => sinon.restore());

  describe("getApplications", function () {
    it("T001 should return all applications for admin", async function () {
      const req = { user: { admin: true, id: "adminid" } };
      const fakeApps = [{ title: "Visa" }];
      sinon.stub(service, "getAllApplications").resolves(fakeApps);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplications(req, res);
      assert.isTrue(res.json.calledWith(fakeApps));
    });

    it("T002 should return empty array for admin when no applications", async function () {
      const req = { user: { admin: true, id: "adminid" } };
      sinon.stub(service, "getAllApplications").resolves([]);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplications(req, res);
      assert.isTrue(res.json.calledWith([]));
    });

    it("T003 should return applications for user", async function () {
      const req = { user: { admin: false, id: "userid" } };
      const fakeApps = [{ title: "Visa" }];
      sinon.stub(service, "getApplications").resolves(fakeApps);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplications(req, res);
      assert.isTrue(res.json.calledWith(fakeApps));
    });

    it("T004 should return 404 if no applications found", async function () {
      const req = { user: { admin: true, id: "adminid" } };
      sinon.stub(service, "getAllApplications").resolves(null);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplications(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledWith({ message: "Application not found" }));
    });

    it("T005 should handle error (500)", async function () {
      sinon.stub(service, "getApplications").throws(new Error("DB Error"));
      const req = { user: { admin: false, id: "userid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplications(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("getApplication", function () {
    it("T006 should return application by id", async function () {
      const req = { params: { id: "appid" } };
      const fakeApp = { title: "Visa" };
      sinon.stub(service, "getApplication").resolves(fakeApp);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplication(req, res);
      assert.isTrue(res.json.calledWith(fakeApp));
    });

    it("T007 should return 404 if not found", async function () {
      sinon.stub(service, "getApplication").resolves(null);
      const req = { params: { id: "appid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T008 should handle error (500)", async function () {
      sinon.stub(service, "getApplication").throws(new Error("DB Error"));
      const req = { params: { id: "appid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("addApplication", function () {
    it("T009 should create a new application (201)", async function () {
      const req = {
        user: { admin: false, id: "userid" },
        body: { title: "Visa" },
      };
      const fakeApp = { title: "Visa" };
      sinon.stub(service, "addApplication").resolves(fakeApp);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addApplication(req, res);
      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledWith(fakeApp));
    });

    it("T010 should create a new application (201)", async function () {
      const req = {
        user: { admin: true, id: "adminid" },
        body: { userId: "otherid", title: "Visa" },
      };
      const fakeApp = { title: "Visa", userId: "otherid" };
      sinon.stub(service, "addApplication").resolves(fakeApp);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addApplication(req, res);
      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledWith(fakeApp));
    });

    it("T011 should handle error (500)", async function () {
      sinon.stub(service, "addApplication").throws(new Error("DB Error"));
      const req = {
        user: { admin: false, id: "userid" },
        body: { title: "Visa" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("updateApplication", function () {
    it("T012 should update existing application", async function () {
      const req = { params: { id: "appid" }, body: { title: "Updated" } };
      const fakeApp = { title: "Visa" };
      const updatedApp = { title: "Updated" };
      sinon.stub(service, "getApplication").resolves(fakeApp);
      sinon.stub(service, "updateApplication").resolves(updatedApp);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await updateApplication(req, res);
      assert.isTrue(res.json.calledWith(updatedApp));
    });

    it("T013 should return 404 for missing application", async function () {
      sinon.stub(service, "getApplication").resolves(null);
      const req = { params: { id: "appid" }, body: { title: "Updated" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T014 should handle error (500)", async function () {
      sinon.stub(service, "getApplication").throws(new Error("DB Error"));
      const req = { params: { id: "appid" }, body: { title: "Updated" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("deleteApplication", function () {
    it("T015 should delete existing application", async function () {
      const req = { params: { id: "appid" } };
      const fakeApp = { title: "Visa" };
      sinon.stub(service, "getApplication").resolves(fakeApp);
      sinon.stub(service, "deleteApplication").resolves(true);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteApplication(req, res);
      assert.isTrue(res.json.calledWith({ message: "application deleted" }));
    });

    it("T016 should return 404 when missing", async function () {
      sinon.stub(service, "getApplication").resolves(null);
      const req = { params: { id: "appid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T017 should handle error (500)", async function () {
      sinon.stub(service, "getApplication").throws(new Error("DB Error"));
      const req = { params: { id: "appid" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });
});
