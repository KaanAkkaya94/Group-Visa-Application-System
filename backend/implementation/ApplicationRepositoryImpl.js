const IApplicationRespository = require("./IApplicationRepository");
const Application = require("../models/Application");
// inheritence
// encapsulation
class ApplicationRespositoryImpl extends IApplicationRespository {
  async findAll() {
    return Application.find({});
  }
  async findById(id) {
    return Application.findById(id);
  }
  async findByUserId(userId) {
    return Application.find({ userId });
  }
  async create(data) {
    return Application.create(data);
  }
  async update(application) {
    // Object.assign(application, updates);
    return application.save();
  }
  async delete(application) {
    return application.remove();
  }
}

module.exports = ApplicationRespositoryImpl;
