//bridge method for Application CRUD
class ApplicationService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllApplications() {
    return this.repository.findAll();
  }

  async getApplication(id) {
    return this.repository.findById(id);
  }

  async getApplications(userId) {
    return this.repository.findByUserId(userId);
  }

  async addApplication(data) {
    return this.repository.create({ ...data });
  }

  async updateApplication(application, data) {
    const {
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
      status,
    } = data;
    application.title = title || application.title;
    application.cost = cost || application.cost;
    application.firstname = firstname || application.firstname;
    application.lastname = lastname || application.lastname;
    application.countryofresidence =
      countryofresidence || application.countryofresidence;
    application.email = email || application.email;
    application.city = city || application.city;
    application.dateofarrival = dateofarrival || application.dateofarrival;
    application.dateofdeparture =
      dateofdeparture || application.dateofdeparture;
    application.status = status || application.status;
    application.passportNo = passportNo || application.passportNo;
    const updatedApplication = this.repository.update(application);
    return updatedApplication;
  }

  async deleteApplication(application) {
    return this.repository.delete(application);
  }
}

module.exports = ApplicationService;
