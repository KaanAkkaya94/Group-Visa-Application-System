//test file for authentification 
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
  deleteUser,
} = require("../controllers/authController");

process.env.JWT_SECRET = "testsecret";

describe("authController exports", function () {
  afterEach(() => sinon.restore());

  describe("registerUser", function () {
    it("T018 should return 400 if user already exists", async function () {
      sinon.stub(User, "findOne").resolves({ email: "test@gmail.com" });
      const req = {
        body: { name: "test", email: "test@gmail.com", password: "1234" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await registerUser(req, res);

      assert.isTrue(res.status.calledWith(400));
      assert.isTrue(res.json.calledWith({ message: "User already exists" }));
    });

    it("T019 should create a new user and return 201", async function () {
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(User, "create").resolves({
        id: "1",
        name: "test",
        email: "test@gmail.com",
        admin: false,
      });
      const req = {
        body: { name: "test", email: "test@gmail.com", password: "1234" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await registerUser(req, res);

      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledOnce);
    });

    it("T020 should create an admin user when name and email match admin", async function () {
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(User, "create").resolves({
        id: "1",
        name: "admin",
        email: "admin@gmail.com",
        admin: true,
      });

      const req = {
        body: { name: "admin", email: "admin@gmail.com", password: "1234" },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await registerUser(req, res);

      assert.isTrue(res.status.calledWith(201));
      assert.isTrue(res.json.calledOnce);
      assert.equal(res.json.firstCall.args[0].admin, true);
    });
  });

  describe("LoginFactory.getUser", function () {
    it("T021 should login user with correct credentials", async function () {
      const fakeUser = {
        id: "1",
        name: "test",
        email: "test@gmail.com",
        password: "hashed",
        admin: false,
      };
      sinon.stub(User, "findOne").resolves(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(true);

      const req = { body: { email: "test@gmail.com", password: "1234" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await LoginFactory.getUser(req, res);

      assert.isTrue(res.json.calledOnce);
    });

    it("T022 should return 401 for invalid credentials", async function () {
      sinon.stub(User, "findOne").resolves(null);

      const req = { body: { email: "wrong@test.com", password: "wrong" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await LoginFactory.getUser(req, res);

      assert.isTrue(res.status.calledWith(401));
      assert.isTrue(res.json.calledOnce);
    });

    it("T023 should return 500 if DB error occurs", async function () {
      sinon.stub(User, "findOne").throws(new Error("DB Error"));

      const req = { body: { email: "test@gmail.com", password: "1234" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await LoginFactory.getUser(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("userProfile.getProfile", function () {
    it("T024 should return user profile if found", async function () {
      sinon.stub(User, "findById").resolves({
        id: "1",
        name: "test",
        email: "test@gmail.com",
        admin: false,
      });
      const req = { user: { id: "1" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.getProfile(req, res);

      assert.isTrue(res.status.calledWith(200));
      assert.isTrue(res.json.calledOnce);
    });

    it("T025 should return 404 if user not found", async function () {
      sinon.stub(User, "findById").resolves(null);
      const req = { user: { id: "1" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.getProfile(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledOnce);
    });

    it("T026 should handle server error", async function () {
      sinon.stub(User, "findById").throws(new Error("DB Error"));
      const req = { user: { id: "1" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.getProfile(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledOnce);
    });
  });

  describe("userProfile.updateUserProfile", function () {
    it("T027 should update logged-in user profile successfully", async function () {
      const fakeUser = {
        id: "1",
        name: "test",
        email: "test@gmail.com",
        city: "Old City",
        address: "asdfasdf",
        phone: "123123123",
        save: sinon.stub().resolves({
          id: "1",
          name: "updated",
          email: "updated@test.com",
          city: "New City",
          address: "kkk",
          phone: "888",
        }),
      };
      sinon.stub(User, "findById").resolves(fakeUser);

      const req = {
        user: { id: "1" },
        body: {
          name: "updated",
          email: "updated@test.com",
          city: "New City",
          address: "kkk",
          phone: "888",
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfile(req, res);

      assert.isTrue(res.status.calledWith(200));
      assert.isTrue(res.json.calledOnce);
      console.log("T025", res.json.firstCall.args[0]);
      assert.equal(res.json.firstCall.args[0].name, "updated");
    });

    it("T028 should return 404 if logged-in user not found", async function () {
      sinon.stub(User, "findById").resolves(null);
      const req = { user: { id: "1" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfile(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledWith({ message: "User not found" }));
    });

    it("T029 should return 500 on DB error", async function () {
      sinon.stub(User, "findById").throws(new Error("DB Error"));
      const req = { user: { id: "1" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfile(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledWith({ message: "DB Error" }));
    });
  });

  describe("userProfile.updateUserProfileById", function () {
    it("T030 should update user profile by id successfully", async function () {
      const fakeUser = {
        id: "2",
        name: "John",
        email: "john@gmail.com",
        city: "Old City",
        address: "asdfasdf",
        phone: "123123123",
        save: sinon.stub().resolves({
          id: "2",
          name: "updatedJane",
          email: "jane@gmail.com",
          city: "Old City",
          address: "Brisbane",
          phone: "999",
        }),
      };
      sinon.stub(User, "findById").resolves(fakeUser);

      const req = {
        params: { id: "2" },
        body: {
          name: "updatedJane",
          email: "jane@gmail.com",
          city: "New City",
          address: "Brisbane",
          phone: "999",
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfileById(req, res);

      assert.isTrue(res.json.calledOnce);
      assert.equal(res.json.firstCall.args[0].name, "updatedJane");
    });

    it("T031 should return 404 if user not found by id", async function () {
      sinon.stub(User, "findById").resolves(null);
      const req = { params: { id: "2" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfileById(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledWith({ message: "User not found" }));
    });

    it("T032 should return 500 on DB error", async function () {
      sinon.stub(User, "findById").throws(new Error("DB Error"));
      const req = { params: { id: "2" }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await userProfile.updateUserProfileById(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledWith({ message: "DB Error" }));
    });
  });

  describe("getAllUsers", function () {
    it("T033 should return all users", async function () {
      sinon.stub(User, "find").resolves([{ id: "1", name: "test" }]);
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getAllUsers(req, res);

      assert.isTrue(res.json.calledOnce);
      assert.isFalse(res.status.calledWith(404));
      assert.isFalse(res.status.calledWith(500));
    });

    it("T034 should return 404 if no users", async function () {
      sinon.stub(User, "find").resolves([]);
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getAllUsers(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledWith({ message: "User not found" }));
    });

    it("T035 should return 500 on db error", async function () {
      sinon.stub(User, "find").throws(new Error("DB Error"));
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getAllUsers(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledWith({ message: "DB Error" }));
    });
  });

  describe("deleteUser", function () {
    it("T036 should delete user successfully", async function () {
      const fakeUser = { remove: sinon.spy() };
      sinon.stub(User, "findById").resolves(fakeUser);
      const req = { params: { id: "123" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteUser(req, res);

      assert.isTrue(fakeUser.remove.calledOnce);
      assert.isTrue(res.json.calledWith({ message: "User deleted" }));
    });

    it("T037 should return 404 if user not found", async function () {
      sinon.stub(User, "findById").resolves(null);
      const req = { params: { id: "123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteUser(req, res);

      assert.isTrue(res.status.calledWith(404));
      assert.isTrue(res.json.calledWith({ message: "User not found" }));
    });

    it("T038 should return 500 on db error", async function () {
      sinon.stub(User, "findById").throws(new Error("DB Error"));
      const req = { params: { id: "123" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteUser(req, res);

      assert.isTrue(res.status.calledWith(500));
      assert.isTrue(res.json.calledWith({ message: "DB Error" }));
    });
  });
});
