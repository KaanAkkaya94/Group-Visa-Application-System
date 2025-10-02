import { createRequire } from "module";
const require = createRequire(import.meta.url);

const assert = require("chai").assert;
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  registerUser,
  LoginFactory,
  userProfile,
  getAllUsers,
} = require("../controllers/authController");

describe("authController exports", function () {
  afterEach(() => sinon.restore());

  describe("registerUser", function () {
    it("T016 should return 400 if user already exists", async function () {
      sinon.stub(User, "findOne").resolves({ email: "test@test.com" });
      const req = {
        body: { name: "test", email: "test@test.com", password: "1234" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await registerUser(req, res);

      assert.isTrue(res.status.calledWith(400));
      assert.isTrue(res.json.calledWith({ message: "User already exists" }));
    });

    it("T017 should create a new user and return 201", async function () {
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(User, "create").resolves({
        id: "1",
        name: "test",
        email: "test@test.com",
        admin: false,
      });
      const req = {
        body: { name: "test", email: "test@test.com", password: "1234" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await registerUser(req, res);

      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("LoginFactory.getUser", function () {
    it("T018 should login user with correct credentials", async function () {
      const fakeUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "hashed",
        admin: false,
      };
      sinon.stub(User, "findOne").resolves(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(true);

      const req = { body: { email: "test@test.com", password: "1234" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await LoginFactory.getUser(req, res);

      assert.isTrue(res.json.calledOnce);
    });

    it("T019 should return 401 for invalid credentials", async function () {
      sinon.stub(User, "findOne").resolves(null);

      const req = { body: { email: "wrong@test.com", password: "wrong" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await LoginFactory.getUser(req, res);

      assert.isTrue(res.status.calledWith(401));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("userProfile.getProfile", function () {
    it("T020 should return user profile if found", async function () {
      sinon.stub(User, "findById").resolves({
        id: "1",
        name: "test",
        email: "test@test.com",
        admin: false,
      });
      const req = { user: { id: "1" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.getProfile(req, res);

      assert.isTrue(res.status.calledWith(200));
      assert.isTrue(res.json.calledOnce);
    });

    it("T021 should return 404 if user not found", async function () {
      sinon.stub(User, "findById").resolves(null);
      const req = { user: { id: "1" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.getProfile(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("getAllUsers", function () {
    it("T022 should return all users", async function () {
      sinon.stub(User, "find").resolves([{ id: "1", name: "test" }]);
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getAllUsers(req, res);

      assert.isTrue(res.json.calledOnce);
    });

    it("T023 should return 404 if no users", async function () {
      sinon.stub(User, "find").resolves(null);
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getAllUsers(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });
  });
});
