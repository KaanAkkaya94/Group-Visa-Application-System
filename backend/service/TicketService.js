class TicketService {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async getTickets(user) {
    return this.strategy.fetchTickets(user);
  }
}

module.exports = TicketService;
