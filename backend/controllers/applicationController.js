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
      title,
      cost,
      firstname,
      lastname,
      countryofresidence,
      email,
      city,
      dateofarrival,
      dateofdeparture,
    } = req.body;
    try {
      const application = await service.addApplication({
        userId: req.user.id,
        title,
        cost,
        firstname,
        lastname,
        countryofresidence,
        email,
        city,
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
    // const {
    //   title,
    //   cost,
    //   firstname,
    //   lastname,
    //   countryofresidence,
    //   email,
    //   city,
    //   dateofarrival,
    //   dateofdeparture,
    // } = req.body;
    try {
      const application = await service.getApplication(req.params.id);
      if (!application)
        return res.status(404).json({ message: "application not found" });
      const result = await service.updateApplication(application, req.body);

      // application.title = title || application.title;
      // application.cost = cost || application.cost;
      // application.firstname = firstname || application.firstname;
      // application.lastname = lastname || application.lastname;
      // application.countryofresidence =
      //   countryofresidence || application.countryofresidence;
      // application.email = email || application.email;
      // application.city = city || application.city;
      // application.dateofarrival = dateofarrival || application.dateofarrival;
      // application.dateofdeparture =
      //   dateofdeparture || application.dateofdeparture;
      // const updatedapplication = await application.save();
      // res.json(updatedapplication);
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

// const getApplication = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application)
//       return res.status(404).json({ message: "Application not found" });
//     res.json(application);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //fetches all applications
// const getApplications = async (req, res) => {
//   try {
//     const applications = await Application.find({ userId: req.user.id });
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//creates a new visa application
// const addapplication = async (req, res) => {
//   const {
//     title,
//     cost,
//     firstname,
//     lastname,
//     countryofresidence,
//     email,
//     city,
//     dateofarrival,
//     dateofdeparture,
//   } = req.body;
//   try {
//     const application = await Application.create({
//       userId: req.user.id,
//       title,
//       cost,
//       firstname,
//       lastname,
//       countryofresidence,
//       email,
//       city,
//       dateofarrival,
//       dateofdeparture,
//     });
//     res.status(201).json(application);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //update an application in the db
// const updateapplication = async (req, res) => {
//   const {
//     title,
//     cost,
//     firstname,
//     lastname,
//     countryofresidence,
//     email,
//     city,
//     dateofarrival,
//     dateofdeparture,
//   } = req.body;
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application)
//       return res.status(404).json({ message: "application not found" });
//     application.title = title || application.title;
//     application.cost = cost || application.cost;
//     application.firstname = firstname || application.firstname;
//     application.lastname = lastname || application.lastname;
//     application.countryofresidence =
//       countryofresidence || application.countryofresidence;
//     application.email = email || application.email;
//     application.city = city || application.city;
//     application.dateofarrival = dateofarrival || application.dateofarrival;
//     application.dateofdeparture =
//       dateofdeparture || application.dateofdeparture;
//     const updatedapplication = await application.save();
//     res.json(updatedapplication);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //delete a single application from the db
// const deleteapplication = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application)
//       return res.status(404).json({ message: "application not found" });
//     await application.remove();
//     res.json({ message: "application deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// module.exports = {
//   getApplications,
//   getApplication,
//   addapplication,
//   updateapplication,
//   deleteapplication,
// };

const applicationController = new ApplicationController();

module.exports = { applicationController };
