// interface
class IAplicationRespository {
  async findById(id) {}
  async findByUserId(userId) {}
  async create(data) {}
  async update(application) {}
  async delete(application) {}
}

module.exports = IAplicationRespository;
