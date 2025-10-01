import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const assert = require('chai').assert;
const sinon = require('sinon');
const mongoose = require('mongoose');
const { 
  getApplications, 
  getApplication, 
  addApplication, 
  updateApplication, 
  deleteApplication 
} = require('../controllers/applicationController');

const ApplicationService = require('../service/ApplicationService');
const service = ApplicationService.prototype;

describe("applicationController exports", function() {
  afterEach(() => sinon.restore());

  describe("getApplications", function() {
    it("should return all applications for admin", async function() {
      const req = { user: { admin: true, id: 'adminid' } };
      const fakeApps = [{ title: 'Visa' }];
      sinon.stub(service, 'getAllApplications').resolves(fakeApps);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplications(req, res);
      assert.isTrue(res.json.calledWith(fakeApps));
    });

    it("should return applications for user", async function() {
      const req = { user: { admin: false, id: 'userid' } };
      const fakeApps = [{ title: 'Visa' }];
      sinon.stub(service, 'getApplications').resolves(fakeApps);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplications(req, res);
      assert.isTrue(res.json.calledWith(fakeApps));
    });

    it("should handle error (500)", async function() {
      sinon.stub(service, 'getApplications').throws(new Error('DB Error'));
      const req = { user: { admin: false, id: 'userid' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplications(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("getApplication", function() {
    it("should return application by id", async function() {
      const req = { params: { id: 'appid' } };
      const fakeApp = { title: 'Visa' };
      sinon.stub(service, 'getApplication').resolves(fakeApp);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApplication(req, res);
      assert.isTrue(res.json.calledWith(fakeApp));
    });

    it("should return 404 if not found", async function() {
      sinon.stub(service, 'getApplication').resolves(null);
      const req = { params: { id: 'appid' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("should handle error (500)", async function() {
      sinon.stub(service, 'getApplication').throws(new Error('DB Error'));
      const req = { params: { id: 'appid' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("addApplication", function() {
    it("should create a new application (201)", async function() {
      const req = { user: { admin: false, id: 'userid' }, body: { title: 'Visa' } };
      const fakeApp = { title: 'Visa' };
      sinon.stub(service, 'addApplication').resolves(fakeApp);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addApplication(req, res);
      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledWith(fakeApp));
    });

    it("should handle error (500)", async function() {
      sinon.stub(service, 'addApplication').throws(new Error('DB Error'));
      const req = { user: { admin: false, id: 'userid' }, body: { title: 'Visa' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("updateApplication", function() {
    it("should update existing application", async function() {
      const req = { params: { id: 'appid' }, body: { title: 'Updated' } };
      const fakeApp = { title: 'Visa' };
      const updatedApp = { title: 'Updated' };
      sinon.stub(service, 'getApplication').resolves(fakeApp);
      sinon.stub(service, 'updateApplication').resolves(updatedApp);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await updateApplication(req, res);
      assert.isTrue(res.json.calledWith(updatedApp));
    });

    it("should return 404 for missing application", async function() {
      sinon.stub(service, 'getApplication').resolves(null);
      const req = { params: { id: 'appid' }, body: { title: 'Updated' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("should handle error (500)", async function() {
      sinon.stub(service, 'getApplication').throws(new Error('DB Error'));
      const req = { params: { id: 'appid' }, body: { title: 'Updated' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("deleteApplication", function() {
    it("should delete existing application", async function() {
      const req = { params: { id: 'appid' } };
      const fakeApp = { title: 'Visa' };
      sinon.stub(service, 'getApplication').resolves(fakeApp);
      sinon.stub(service, 'deleteApplication').resolves(true);
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteApplication(req, res);
      assert.isTrue(res.json.calledWith({ message: "application deleted" }));
    });

    it("should return 404 when missing", async function() {
      sinon.stub(service, 'getApplication').resolves(null);
      const req = { params: { id: 'appid' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteApplication(req, res);
      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("should handle error (500)", async function() {
      sinon.stub(service, 'getApplication').throws(new Error('DB Error'));
      const req = { params: { id: 'appid' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteApplication(req, res);
      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });
});