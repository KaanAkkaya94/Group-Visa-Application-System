//bridge method for Application CRUD
class ApplicationService {
  constructor(repository) {
    this.repository = repository;
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
      dateofarrival,
      dateofdeparture,
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
    const updatedApplication = this.repository.update(application);
    return updatedApplication;
  }

  async deleteApplication(application) {
    return this.repository.delete(application);
  }
}

module.exports = ApplicationService;
