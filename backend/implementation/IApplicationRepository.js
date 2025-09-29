// interface
class IAplicationRespository {
  // for admin to get all applications
  async findAll() {}
  async findById(id) {}
  async findByUserId(userId) {}
  async create(data) {}
  async update(application) {}
  async delete(application) {}
}

module.exports = IAplicationRespository;
