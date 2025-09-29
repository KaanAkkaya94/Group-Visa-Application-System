const Ticket = require("../models/Ticket");
const TicketFetchStrategy = require("./TicketFetchStrategy");

class UserTicketFetchStrategy extends TicketFetchStrategy {
  async fetchTickets(user) {
    return Ticket.find({ userId: user.id });
  }
}

module.exports = UserTicketFetchStrategy;
