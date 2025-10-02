// const Application = require("../models/Application");
const ApplicationService = require("../service/ApplicationService");
const ApplicationRepositoryImpl = require("../implementation/ApplicationRepositoryImpl");
//fetches a single application
// bridge, abtraction and implementation
const repository = new ApplicationRepositoryImpl();
const service = new ApplicationService(repository);

class ApplicationController {
  async getApplication(req, res) {
    try {
      const application = await service.getApplication(req.params.id);
      if (!application)
        return res.status(404).json({ message: "Application not found" });
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //fetches all applications
  async getApplications(req, res) {
    try {
      let applications;
      const { admin } = req.user;
      if (admin === true) {
        applications = await service.getAllApplications();
      } else {
        applications = await service.getApplications(req.user.id);
      }
      if (!applications)
        res.status(404).json({ message: "Application not found" });
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //creates a new visa application
  async addApplication(req, res) {
    const {
      userId,
      title,
      cost,
      firstname,
      lastname,
      countryofresidence,
      email,
      city,
      passportNo,
      dateofarrival,
      dateofdeparture,
    } = req.body;
    try {
      const application = await service.addApplication({
        userId: req.user.admin ? userId : req.user.id,
        title,
        cost,
        firstname,
        lastname,
        countryofresidence,
        email,
        city,
        passportNo,
        dateofarrival,
        dateofdeparture,
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //update an application in the db
  async updateApplication(req, res) {
    try {
      const application = await service.getApplication(req.params.id);
      if (!application)
        return res.status(404).json({ message: "application not found" });
      const result = await service.updateApplication(application, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //delete a single application from the db
  async deleteApplication(req, res) {
    try {
      const application = await service.getApplication(req.params.id);
      if (!application)
        return res.status(404).json({ message: "application not found" });
      const result = await service.deleteApplication(application);
      // await application.remove();
      res.json({ message: "application deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const applicationController = new ApplicationController();

module.exports = {
  getApplications: applicationController.getApplications.bind(
    applicationController
  ),
  getApplication: applicationController.getApplication.bind(
    applicationController
  ),
  addApplication: applicationController.addApplication.bind(
    applicationController
  ),
  updateApplication: applicationController.updateApplication.bind(
    applicationController
  ),
  deleteApplication: applicationController.deleteApplication.bind(
    applicationController
  ),
};
